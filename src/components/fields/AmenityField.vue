<template>
  <div>
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
            @change="handleAddonSelect(index, $event)"
            :item-disabled="(item) => isItemDisabled(item, index)"
            :clearable="!readonly"
            :rules="[
              (v) => (addons.length > 1 ? !!v || 'Add-on is required' : true),
            ]"
            :readonly="readonly"
          />

          <CounterButtons
            :quantity="Number(addon.quantity)"
            :incrementFn="() => addon.quantity++"
            :decrementFn="() => decrementQuantity(index)"
            :readonly="readonly"
          />

          <v-menu>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item
                v-for="(item, i) in menuItems"
                :key="i"
                @click="item.action(addon)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

      <v-btn
        depressed
        :ripple="false"
        color="primary"
        class="mt-4"
        small
        @click="handleAddItem"
        :disabled="readonly"
      >
        Add More
      </v-btn>
    </FormField>

    <ChargeDistributionDialog
      v-if="chargeDistributionDialog"
      v-model="chargeDistributionDialog"
      :addon="selectedAddonForChargeDistribution"
      :guestName="guestName"
      @save="handleChargeDistributionSave"
      :existingCharges="existingCharges"
    />
  </div>
</template>

<script>
import FormField from "./FormField.vue";
import CounterButtons from "../buttons/CounterButtons.vue";
import ChargeDistributionDialog from "@/components/dialogs/ChargeDistributionDialog.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "AmenityField",
  components: { FormField, CounterButtons, ChargeDistributionDialog },
  props: {
    fetchAction: {
      type: String,
      default: "addons",
    },
    value: Array,
    readonly: {
      type: Boolean,
      default: false,
    },
    guestName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      addons: [
        {
          name: null,
          referenceNumber: null,
          quantity: 1,
        },
      ],
      menuItems: [
        {
          title: "Charge Distribution",
          action: (addon) => {
            this.selectedAddonForChargeDistribution = addon;
            this.chargeDistributionDialog = true;
          },
        },
      ],
      chargeDistributionDialog: false,
      selectedAddonForChargeDistribution: null,
    };
  },
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
        referenceNumber: null,
        quantity: 1,
      });
    },
    handleAddonSelect(index, selectedName) {
      const addon = this.addons[index];
      if (selectedName) {
        const selectedItem = this.enums.find(
          (item) => item.name === selectedName
        );
        if (selectedItem && selectedItem.referenceNumber) {
          this.$set(addon, "referenceNumber", selectedItem.referenceNumber);
        }
      } else {
        this.$set(addon, "referenceNumber", null);
      }
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
    handleChargeDistributionSave(updatedAddon) {
      const index = this.addons.findIndex(
        (addon) => addon === this.selectedAddonForChargeDistribution
      );
      if (index !== -1) {
        this.$set(this.addons, index, updatedAddon);
      }
      this.selectedAddonForChargeDistribution = null;
      this.chargeDistributionDialog = false;
    },
  },
  computed: {
    ...mapState("addonsEnum", {
      enum_addons: "addons",
    }),
    ...mapState("amenities", {
      enum_amenities: "amenities",
    }),
    enums() {
      const returnVals = {
        addons: this.enum_addons,
        amenities: this.enum_amenities,
      };
      return returnVals[this.fetchAction] || [];
    },
    existingCharges() {
      if (!this.selectedAddonForChargeDistribution?.folio) return null;

      const chargeDistributionType =
        this.selectedAddonForChargeDistribution?.folio?.chargeDistributionType;

      if (!chargeDistributionType) return null;

      const folioCopy = this.selectedAddonForChargeDistribution?.folio;
      delete folioCopy.type;
      delete folioCopy.chargeDistributionType;
      const folios = Object.values(folioCopy).map((f) => {
        return {
          name: f?.name || "",
          charge: f?.charge ? f.charge * 100 : null,
          amount: f?.amount ?? null,
        };
      });

      return {
        chargeDistributionType,
        folios,
      };
    },
  },
  watch: {
    addons: {
      deep: true,
      handler: function (v) {
        const emptyPaylod = [];
        const isDefault =
          v.length === 1 && v[0].name === null && v[0].quantity === 1;

        this.$emit("onInput", isDefault ? emptyPaylod : v);
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
