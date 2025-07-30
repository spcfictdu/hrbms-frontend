<template>
  <DialogTemplate
    :action="meta.action"
    :title="meta.actionType"
    maxWidth="500"
    :opened="opened"
    :onClose="onClose"
    titleClasses="primary--text"
    :persistent="persistent"
    @onSubmit="handleSubmit"
  >
    <v-row class="text-body-2 text-uppercase">
      <v-col v-for="data in balanceData" :key="data.name" cols="6">
        <div>{{ data.name.replaceAll("_", " ") }}</div>
        <div class="font-weight-bold">
          PHP {{ data.totalAmount.toFixed(2) }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormField
          v-if="meta.submitBtnText === 'Close'"
          label="CLOSING BALANCE"
        >
          <v-text-field
            v-model.number="closingBalance"
            dense
            outlined
            type="number"
            hide-spin-buttons
            autofocus
            :rules="[() => !!closingBalance || 'Closing Balance is required']"
          />
        </FormField>
        <FormField :label="fieldLabel.toUpperCase()">
          <v-text-field
            v-model.number="adjustment"
            dense
            outlined
            type="number"
            hide-spin-buttons
            autofocus
            :rules="adjustmentRules"
            @input="() => SET_ADJUSTMENT(adjustment)"
          />
        </FormField>
      </v-col>
    </v-row>
    <v-card-actions class="pa-0 mt-4">
      <v-row dense>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6"
          ><v-btn
            type="submit"
            text
            block
            color="primary"
            class="lightBg"
            :loading="loading"
            >{{ meta.submitBtnText }}</v-btn
          ></v-col
        >
      </v-row>
    </v-card-actions>
  </DialogTemplate>
</template>

<script>
import DialogTemplate from "./DialogTemplate.vue";
import FormField from "../fields/FormField.vue";
import { mapMutations } from "vuex";

export default {
  name: "CashierDialog",
  components: { DialogTemplate, FormField },
  props: {
    opened: Boolean,
    onClose: Function,
    loading: Boolean,
    meta: Object,
    balanceData: Array,
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    adjustment: "",
    closingBalance: "",
  }),
  methods: {
    ...mapMutations("cashier", ["SET_ADJUSTMENT"]),

    handleSubmit() {
      let payload = {
        [this.meta.submitBtnText === "Open"
          ? "openingAdjustment"
          : "closingAdjustment"]: this.adjustment,
      };

      if (this.meta.submitBtnText === "Close")
        payload.closingBalance = this.closingBalance;

      this.$emit("submit", payload);
    },
  },
  computed: {
    adjustmentRules() {
      return [
        () =>
          !!this.adjustment ||
          this.adjustment === 0 ||
          `${this.fieldLabel} is required`,
        ...(this.meta.submitBtnText === "Open"
          ? [
              () =>
                this.adjustment >= 0 ||
                `${this.fieldLabel} must be 0 or greater`,
            ]
          : []),
      ];
    },

    fieldLabel() {
      return this.meta.submitBtnText === "Open"
        ? "Opening Adjustment"
        : "Adjustment Amount";
    },
  },
  watch: {
    opened(val) {
      if (val) {
        this.adjustment = this.closingBalance = "";
      }
    },
  },
};
</script>
