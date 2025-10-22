<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card class="py-2">
      <v-card-text class="pt-2 pb-0">
        <v-form ref="form" @submit.prevent="save">
          <ChargeDistribution
            ref="chargeDistribution"
            :guestName="guestName"
            @change="updateFolio"
            :itemAmount="calculatedItemAmount"
            :existing-charges="existingCharges"
          >
            <v-card-actions class="px-0">
              <v-btn :loading="loading" block color="primary" type="submit"
                >Save</v-btn
              >
            </v-card-actions>
          </ChargeDistribution>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ChargeDistribution from "@/components/form-templates/ChargeDistribution.vue";
import { mapState } from "vuex";

export default {
  name: "ChargeDistributionDialog",
  components: {
    ChargeDistribution,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    addon: {
      type: Object,
      default: null,
    },
    itemAmount: {
      type: Number,
      default: 0,
    },
    guestName: String,
    loading: Boolean,
    existingCharges: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      folio: {
        type: "INDIVIDUAL",
      },
    };
  },
  computed: {
    ...mapState("transaction", ["transaction"]),
    ...mapState("addonsEnum", ["addons"]),
    calculatedItemAmount() {
      if (!this.addon) return this.itemAmount;

      const addon = this.addons.find(
        (a) => a.referenceNumber === this.addon.referenceNumber
      );
      const addonPrice = addon?.price ?? 0;
      return Number(addonPrice) * this.addon.quantity;
    },
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    payload() {
      if (this.addon) {
        return {
          ...this.addon,
          folio: this.folio,
        };
      }
      return { folio: this.folio };
    },
  },
  methods: {
    updateFolio(folio) {
      this.folio = folio;
    },
    save() {
      if (!this.$refs.form.validate()) return;
      this.$emit("save", this.payload);
    },
    resetForm() {
      if (this.$refs.chargeDistribution) {
        this.$refs.chargeDistribution.reset();
      }
      this.folio = {
        type: "INDIVIDUAL",
      };
    },
  },
};
</script>
