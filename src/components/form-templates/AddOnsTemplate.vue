<template>
  <FormSection title="Add-Ons">
    <FormField label="Amenities">
      <div class="d-flex flex-column" style="gap: 8px">
        <div
          class="d-flex align-center flex-nowrap"
          style="gap: 16px"
          v-for="(addon, index) in payload.addons"
          :key="index"
        >
          <v-autocomplete
            dense
            hide-details="auto"
            outlined
            :items="addons"
            item-text="name"
            v-model="addon.name"
            :item-disabled="(item) => isItemDisabled(item, index)"
            clearable
            :rules="[
              (v) =>
                payload.addons.length > 1 ? !!v || 'Add-on is required' : true,
            ]"
          />

          <CounterButtons
            :quantity="addon.quantity"
            :incrementFn="() => addon.quantity++"
            :decrementFn="() => decrementQuantity(index)"
          />
        </div>
      </div>

      <v-btn
        depressed
        :ripple="false"
        color="primary"
        class="mt-4"
        small
        @click="handleAddItem"
      >
        Add More
      </v-btn>
    </FormField>
  </FormSection>
</template>

<script>
import FormSection from "../sections/FormSection.vue";
import FormField from "../fields/FormField.vue";
import { mapActions, mapState } from "vuex";
import CounterButtons from "../buttons/CounterButtons.vue";
export default {
  name: "AddOnsTemplate",
  components: {
    FormSection,
    FormField,
    CounterButtons,
  },
  data: () => ({
    payload: {
      addons: [
        {
          name: null,
          quantity: 1,
        },
      ],
    },
  }),
  created() {
    this.fetchAddons();
  },
  methods: {
    ...mapActions("addonsEnum", ["fetchAddons"]),
    handleAddItem() {
      this.payload.addons.push({
        name: null,
        quantity: 1,
      });
    },
    // Disable an amenity if it's already selected in another addon entry
    isItemDisabled(item, currentIndex) {
      return this.payload.addons.some(
        (addon, index) => index !== currentIndex && addon.name === item.name
      );
    },
    // Decrement quantity; remove item if quantity reaches 0
    decrementQuantity(index) {
      const { addons } = this.payload;

      if (addons[index].quantity > 1) {
        addons[index].quantity--;
      } else if (addons.length > 1) {
        addons.splice(index, 1);
      }
    },
  },
  computed: {
    ...mapState("addonsEnum", ["addons"]),
  },
  watch: {
    payload: {
      deep: true,
      handler: function (v) {
        const nullPayload = {
          addons: null,
        };
        const isDefault =
          v.addons?.length === 1 &&
          v.addons[0].name === null &&
          v.addons[0].quantity === 1;

        this.$emit("emit-transaction", isDefault ? nullPayload : v);
      },
    },
  },
};
</script>

<style scoped></style>
