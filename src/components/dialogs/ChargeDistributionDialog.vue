<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card class="py-2">
      <v-card-text class="pt-2 pb-0">
        <ChargeDistribution
          ref="chargeDistributionForm"
          :guestName="guestName"
          @change="updateFolio"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" @click="save">Save</v-btn>
      </v-card-actions>
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
      const processedFolio = { ...this.folio };
      if (processedFolio.folioType !== undefined) {
        processedFolio.type = processedFolio.folioType;
        delete processedFolio.folioType;
      }
      this.$emit("save", { ...this.addon, folio: processedFolio });
      this.close();
    },
  },
};
</script>
