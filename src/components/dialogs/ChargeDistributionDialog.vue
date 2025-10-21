<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card class="py-2">
      <v-card-text class="pt-5">
        <v-form ref="form" @submit.prevent="save">
          <ChargeDistribution
            :guestName="guestName"
            @change="updateFolio"
            :itemAmount="itemAmount"
          >
            <v-card-actions class="pa-0">
              <v-btn block color="primary" type="submit">Save</v-btn>
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
      type: Object | null,
      required: true,
    },
    guestName: String,
  },
  data() {
    return {
      folio: null,
    };
  },
  computed: {
    ...mapState("transaction", ["transaction"]),
    ...mapState("addonsEnum", ["addons"]),
    itemAmount() {
      if (!this.addon) return 0;

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
    // guestName() {
    //   return this.transaction?.guestName || "";
    // },
  },
  methods: {
    updateFolio(folio) {
      this.folio = folio;
    },
    close() {
      this.dialog = false;
    },
    save() {
      if (!this.$refs.form.validate()) return;
      const payload = {
        ...this.addon,
        folio: { ...this.folio },
      };
      this.$emit("save", payload);
      this.close();
    },
  },
};
</script>
