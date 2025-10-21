<template>
  <div>
    <FormSection title="Charge Distribution">
      <v-radio-group hide-details="auto" row v-model="folioType" mandatory>
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
              label="Charge (%)"
              dense
              outlined
              hint="Percentage (50 = 50%)"
              persistent-hint
              step="1"
              :min="0"
              :max="100"
              :rules="chargeRules"
            />
            <v-text-field
              v-else
              readonly
              :value="remainingPercent"
              label="Charge (%)"
              dense
              outlined
              hint="Remaining percentage"
              persistent-hint
            />
          </v-col>
        </v-row>
      </FormField>
      <v-alert
        v-if="totalSponsoredPercent > 100"
        type="error"
        dense
        class="mt-2"
      >
        Total sponsored charges exceed 100%. Please adjust the values.
      </v-alert>
    </div>
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
      return this.folios
        .slice(1)
        .reduce((sum, folio) => sum + (Number(folio.charge) || 0), 0);
    },
    remainingPercent() {
      const remaining = 100 - this.totalSponsoredPercent;
      return remaining < 0 ? remaining : Math.max(0, remaining);
    },
    chargeRules() {
      const totalCheck = () =>
        this.totalSponsoredPercent <= 100 ||
        "Total sponsored charges must not exceed 100%";
      return [
        (v) => (!isNaN(v) && v >= 0) || "Minimum charge is 0",
        (v) => (!isNaN(v) && v <= 100) || "Maximum charge is 100",
        totalCheck,
      ];
    },
    folioPayload() {
      if (this.folioType === "INDIVIDUAL") {
        return { type: "INDIVIDUAL" };
      }

      if (this.folioType === "SPONSORED") {
        if (this.totalSponsoredPercent > 100) {
          // Optionally, don't emit invalid payload, or emit with warning
          console.warn("Invalid folio distribution: total exceeds 100%");
          return null; // or return payload anyway
        }

        const payload = {
          type: "SPONSORED",
        };

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
        // Reset folios when switching away from sponsored
        this.folios.forEach((f) => {
          f.name = "";
          f.charge = null;
        });
      }
    },
  },
  mounted() {
    // Initial emit if needed
    this.$emit("change", this.folioPayload);
  },
};
</script>
