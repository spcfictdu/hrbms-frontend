<template>
  <FormField label="Amenities">
    <div class="d-flex flex-column" style="gap: 8px">
      <div
        class="d-flex align-start flex-nowrap"
        style="gap: 16px"
        v-for="(addon, index) in addons"
        :key="index"
      >
        <v-autocomplete
          dense
          hide-details="auto"
          outlined
          :items="enums"
          item-text="name"
          v-model="addon.name"
          :item-disabled="(item) => isItemDisabled(item, index)"
          clearable
          :rules="[
            (v) => (addons.length > 1 ? !!v || 'Add-on is required' : true),
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
</template>

<script>
import FormField from "./FormField.vue";
import CounterButtons from "../buttons/CounterButtons.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "AmenityField",
  components: { FormField, CounterButtons },
  props: {
    fetchAction: {
      type: String,
      default: "addons",
    },
    value: Array,
  },
  data: () => ({
    addons: [
      {
        name: null,
        quantity: 1,
      },
    ],
  }),
  created() {
    this.fetch();
  },
  methods: {
    ...mapActions("addonsEnum", ["fetchAddons"]),
    ...mapActions("amenities", ["fetchAmenities"]),
    fetch: async function () {
      const actions = {
        addons: this.fetchAddons,
        amenities: this.fetchAmenities,
      };
      if (actions[this.fetchAction]) {
        await actions[this.fetchAction]();
      }
    },
    handleAddItem() {
      this.addons.push({
        name: null,
        quantity: 1,
      });
    },
    // Disable an amenity if it's already selected in another addon entry
    isItemDisabled(item, currentIndex) {
      return this.addons.some(
        (addon, index) => index !== currentIndex && addon.name === item.name
      );
    },
    // Decrement quantity; remove item if quantity reaches 0
    decrementQuantity(index) {
      const addons = this.addons;

      if (addons[index].quantity > 1) {
        addons[index].quantity--;
      } else if (addons.length > 1) {
        addons.splice(index, 1);
      }
    },
  },
  computed: {
    ...mapState("addonsEnum", {
      enum_addons: "addons",
    }),
    ...mapState("amenities", {
      enum_amenities: "amenities",
    }),
    enums: function () {
      const returnVals = {
        addons: this.enum_addons,
        amenities: this.enum_amenities,
      };
      return returnVals[this.fetchAction] || [];
    },
  },
  watch: {
    addons: {
      deep: true,
      handler: function (v) {
        const nullPayload = null;
        const isDefault =
          v.length === 1 && v[0].name === null && v[0].quantity === 1;

        this.$emit("onInput", isDefault ? nullPayload : v);
      },
    },
    value: {
      immediate: true,
      handler: function (v) {
        if (v && v.length > 0) {
          this.addons = v;
        }
      },
    },
  },
};
</script>

<style scoped></style>
