<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card class="py-2">
      <v-card-text class="pt-2 pb-0">
        <v-form ref="form" @submit.prevent="save">
          <ChargeDistribution
            :guestName="guestName"
            @change="updateFolio"
            :addonAmount="addonAmount"
          >
            <v-card-actions>
              <v-btn block color="primary" type="submit">Save</v-btn>
            </v-card-actions>
          </ChargeDistribution>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import ChargeDistribution from "@/components/form-templates/ChargeDistribution.vue";

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
      required: true,
    },
  },
  data() {
    return {
      folio: null,
    };
  },
  computed: {
    ...mapState("transaction", ["transaction"]),
    ...mapState("addonsEnum", ["addons"]),
    addonAmount() {
      return (
        Number(
          this.addons.find(
            (a) => a.referenceNumber === this.addon.referenceNumber
          ).price
        ) * this.addon.quantity
      );
    },
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    guestName() {
      return this.transaction?.guestName || "";
    },
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
