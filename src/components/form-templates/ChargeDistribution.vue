<template>
  <div>
    <FormSection title="Charge Distribution">
      <v-radio-group
        hide-details="auto"
        row
        v-model="folioType"
        :rules="[(v) => !!v || 'Selection is required']"
        mandatory
      >
        <v-row>
          <v-col
            v-for="distribution in distributions"
            :key="distribution.value"
          >
            <v-card outlined>
              <v-radio
                class="pa-3 mr-0"
                :label="distribution.label"
                :value="distribution.value"
              >
              </v-radio>
            </v-card>
          </v-col>
        </v-row>
      </v-radio-group>

      <v-radio-group
        v-if="folioType === 'SPONSORED'"
        hide-details="auto"
        row
        v-model="chargeDistributionType"
        mandatory
        class="mt-4"
      >
        <v-row>
          <v-col>
            <v-card outlined>
              <v-radio
                class="pa-3 mr-0"
                label="Percentage"
                value="PERCENT"
              ></v-radio>
            </v-card>
          </v-col>
          <v-col>
            <v-card outlined>
              <v-radio
                class="pa-3 mr-0"
                label="Fixed Amount"
                value="FIXED_AMOUNT"
              ></v-radio>
            </v-card>
          </v-col>
        </v-row>
      </v-radio-group>
    </FormSection>

    <div v-if="folioType === 'SPONSORED'">
      <FormField
        v-for="(folio, index) in folioFields"
        :key="index"
        :label="folio.label"
      >
        <v-row class="pt-1">
          <v-col cols="12" sm="7">
            <v-text-field
              v-if="index !== 0"
              v-model="folios[index].name"
              label="Name"
              dense
              outlined
            />
            <v-text-field
              v-else
              readonly
              :value="guestName"
              label="Name"
              dense
              outlined
            />
          </v-col>
          <v-col cols="12" sm="5">
            <v-text-field
              v-if="index !== 0"
              hide-spin-buttons
              type="number"
              v-model.number="folios[index].charge"
              :label="
                chargeDistributionType === 'PERCENT'
                  ? 'Charge (%)'
                  : 'Charge (Amount)'
              "
              dense
              outlined
              :hint="
                chargeDistributionType === 'PERCENT'
                  ? 'Percentage (50 = 50%)'
                  : 'Fixed amount'
              "
              persistent-hint
              step="1"
              :min="0"
              :max="chargeDistributionType === 'PERCENT' ? 100 : undefined"
              :rules="
                index !== 0 && folioType === 'SPONSORED'
                  ? chargeDistributionType === 'PERCENT'
                    ? chargeRules
                    : amountRules
                  : []
              "
            />
            <v-text-field
              v-else
              readonly
              :value="
                chargeDistributionType === 'PERCENT'
                  ? remainingPercent
                  : remainingAmount
              "
              :label="
                chargeDistributionType === 'PERCENT'
                  ? 'Charge (%)'
                  : 'Charge (Amount)'
              "
              dense
              outlined
              :hint="
                chargeDistributionType === 'PERCENT'
                  ? 'Remaining percentage'
                  : 'Remaining amount'
              "
              persistent-hint
            />
          </v-col>
        </v-row>
      </FormField>
      <v-alert
        v-if="
          chargeDistributionType === 'PERCENT' && totalSponsoredPercent > 100
        "
        type="error"
        dense
        class="mt-2"
      >
        Total sponsored charges exceed 100%. Please adjust the values.
      </v-alert>
      <v-alert
        v-if="
          chargeDistributionType === 'FIXED_AMOUNT' &&
          totalSponsoredAmount > itemAmount
        "
        type="error"
        dense
        class="mt-2"
      >
        Total sponsored amounts exceed the total amount. Please adjust the
        values.
      </v-alert>
    </div>

    <slot />
  </div>
</template>

<script>
import FormSection from "@/components/sections/FormSection.vue";
import FormField from "@/components/fields/FormField.vue";

export default {
  name: "ChargeDistribution",
  components: { FormSection, FormField },
  props: {
    guestName: String,
    itemAmount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      distributions: [
        { label: "Individual", value: "INDIVIDUAL" },
        { label: "Sponsored", value: "SPONSORED" },
      ],
      folioFields: [
        { label: "Folio A" },
        { label: "Folio B" },
        { label: "Folio C" },
        { label: "Folio D" },
      ],

      folioType: "INDIVIDUAL",
      chargeDistributionType: "PERCENT",
      folios: [
        { name: "", charge: null },
        { name: "", charge: null },
        { name: "", charge: null },
        { name: "", charge: null },
      ],
    };
  },
  computed: {
    totalSponsoredPercent() {
      if (this.chargeDistributionType !== "PERCENT") return 0;
      return this.folios
        .slice(1)
        .reduce((sum, folio) => sum + (Number(folio.charge) || 0), 0);
    },
    remainingPercent() {
      if (this.chargeDistributionType !== "PERCENT") return 0;
      const remaining = 100 - this.totalSponsoredPercent;
      return remaining < 0 ? remaining : Math.max(0, remaining);
    },
    totalSponsoredAmount() {
      if (this.chargeDistributionType !== "FIXED_AMOUNT") return 0;
      return this.folios
        .slice(1)
        .reduce((sum, folio) => sum + (Number(folio.charge) || 0), 0);
    },
    remainingAmount() {
      if (this.chargeDistributionType !== "FIXED_AMOUNT") return 0;
      const remaining = this.itemAmount - this.totalSponsoredAmount;
      return remaining < 0
        ? remaining.toFixed(2)
        : Math.max(0, remaining).toFixed(2);
    },
    chargeRules() {
      // for PERCENT
      return [
        (v) => (!isNaN(v) && v >= 0) || "Minimum charge is 0",
        (v) => (!isNaN(v) && v <= 100) || "Maximum charge is 100",
      ];
    },
    amountRules() {
      // for FIXED_AMOUNT

      return [
        (v) => (!isNaN(v) && v >= 0) || "Minimum amount is 0",
        (v) =>
          (!isNaN(v) && v <= this.itemAmount) ||
          `Total sponsored amounts must not exceed ${this.itemAmount}`,
      ];
    },
    folioPayload() {
      if (this.folioType === "INDIVIDUAL") {
        return {
          type: "INDIVIDUAL",
        };
      }

      if (this.folioType === "SPONSORED") {
        const payload = {
          type: "SPONSORED",
        };

        if (this.chargeDistributionType === "PERCENT") {
          // Folio A
          const folioA = (payload.folioA = {
            charge: this.remainingPercent / 100,
          });
          if (this.guestName && this.guestName.trim()) {
            folioA.name = this.guestName.trim();
          }

          // Folios B, C, D
          this.folios.slice(1).forEach((folio, index) => {
            const folioIndex = index + 1;
            const charge = Number(folio.charge) || 0;
            const folioKey = `folio${String.fromCharCode(65 + folioIndex)}`;
            payload[folioKey] = { charge: charge / 100 };
            if (folio.name && folio.name.trim()) {
              payload[folioKey].name = folio.name.trim();
            }
          });
        } else if (this.chargeDistributionType === "FIXED_AMOUNT") {
          // Folio A
          const folioA = (payload.folioA = {
            amount: this.remainingAmount,
          });
          if (this.guestName && this.guestName.trim()) {
            folioA.name = this.guestName.trim();
          }

          // Folios B, C, D
          this.folios.slice(1).forEach((folio, index) => {
            const folioIndex = index + 1;
            const amount = Number(folio.charge) || 0; // still using folio.charge for v-model
            const folioKey = `folio${String.fromCharCode(65 + folioIndex)}`;
            payload[folioKey] = { amount: amount };
            if (folio.name && folio.name.trim()) {
              payload[folioKey].name = folio.name.trim();
            }
          });
        }

        return payload;
      }

      return null;
    },
  },
  watch: {
    folioPayload: {
      handler(newPayload) {
        this.$emit("change", newPayload);
      },
      deep: true,
    },
    folioType(newVal) {
      if (newVal !== "SPONSORED") {
        this.folios.forEach((f) => {
          f.name = "";
          f.charge = null;
        });
      }
    },
    chargeDistributionType(newVal) {
      // Reset charges when switching type
      this.folios.forEach((f) => {
        f.charge = null;
      });
    },
  },
  mounted() {
    // Initial emit if needed
    this.$emit("change", this.folioPayload);
  },
};
</script>
