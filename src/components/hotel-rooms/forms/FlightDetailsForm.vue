<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-row>
      <v-col cols="12">
        <div class="text-overline font-weight-bold">Guest Name</div>
        <v-row>
          <v-col>
            <div class="longText--text text-uppercase text-caption">
              First Name
            </div>
            <v-text-field
              class="text-body-2"
              hide-details="auto"
              dense
              outlined
              background-color="white"
              v-model.trim="form.firstName"
              @input="form.firstName = form.firstName.toLocaleUpperCase()"
              :rules="rules.name"
            ></v-text-field>
          </v-col>
          <v-col>
            <div class="longText--text text-uppercase text-caption">
              Last Name
            </div>
            <v-text-field
              class="text-body-2"
              dense
              outlined
              background-color="white"
              v-model.trim="form.lastName"
              @input="form.lastName = form.lastName.toLocaleUpperCase()"
              :rules="rules.name"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">
        <div class="text-overline font-weight-bold">Arrival</div>
        <v-row>
          <v-col cols="12">
            <div class="longText--text text-uppercase text-caption">
              Flight #
            </div>
            <v-text-field
              class="text-body-2"
              dense
              outlined
              background-color="white"
              v-model.trim="form.arrivalFlightNumber"
              @input="
                form.arrivalFlightNumber =
                  form.arrivalFlightNumber.toLocaleUpperCase()
              "
              :rules="rules.arrivalFlightNumber"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <div class="longText--text text-uppercase text-caption">
              Date of Arrival
            </div>
            <DateField
              :model="form.arrivalDate"
              :hideDetails="false"
              prependInnerIcon="mdi-calendar"
              backgroundColor="white"
              @input="form.arrivalDate = $event"
              :rules="rules.arrivalDate"
            />
          </v-col>
          <v-col :style="{ paddingTop: 0 }" cols="12">
            <div class="longText--text text-uppercase text-caption">
              Flight ETA
            </div>
            <TimeField
              backgroundColor="white"
              :model="form.arrivalTime"
              @input="form.arrivalTime = $event"
              :rules="rules.arrivalTime"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">
        <div class="text-overline font-weight-bold">Departure</div>
        <v-row>
          <v-col cols="12">
            <div class="longText--text text-uppercase text-caption">
              Flight #
            </div>
            <v-text-field
              class="text-body-2"
              dense
              outlined
              background-color="white"
              v-model.trim="form.departureFlightNumber"
              @input="
                form.departureFlightNumber =
                  form.departureFlightNumber.toLocaleUpperCase()
              "
              :rules="rules.departureFlightNumber"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <div class="longText--text text-uppercase text-caption">
              Date of Departure
            </div>
            <DateField
              :hideDetails="false"
              prependInnerIcon="mdi-calendar"
              backgroundColor="white"
              :model="form.departureDate"
              @input="form.departureDate = $event"
              :rules="rules.departureDate"
            />
          </v-col>
          <v-col :style="{ paddingTop: 0 }" cols="12">
            <div class="longText--text text-uppercase text-caption">
              Flight ETD
            </div>
            <TimeField
              backgroundColor="white"
              :model="form.departureTime"
              @input="form.departureTime = $event"
              :rules="rules.departureTime"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col>
        <v-btn
          :loading="loading.form"
          block
          depressed
          color="primary"
          type="submit"
          >Save</v-btn
        >
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import DateField from "@/components/fields/DateField.vue";
import TimeField from "@/components/fields/TimeField.vue";
import { mapMutations, mapState } from "vuex";

export default {
  name: "FlightDetailsForm",
  components: { DateField, TimeField },
  props: {
    flightDetails: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        arrivalFlightNumber: "",
        arrivalDate: "",
        arrivalTime: "",
        departureFlightNumber: "",
        departureDate: "",
        departureTime: "",
      },
    };
  },
  computed: {
    ...mapState("transaction", ["loading"]),
    rules() {
      return {
        name: [(v) => !!v || "Name is required"],
        arrivalFlightNumber: [
          (v) =>
            !!this.form.departureFlightNumber ||
            !!v ||
            "At least one flight number is required",
        ],
        departureFlightNumber: [
          (v) =>
            !!this.form.arrivalFlightNumber ||
            !!v ||
            "At least one flight number is required",
        ],
        arrivalDate: [
          (v) => !this.form.arrivalFlightNumber || !!v || "Date is required",
        ],
        arrivalTime: [
          (v) => !this.form.arrivalFlightNumber || !!v || "Time is required",
        ],
        departureDate: [
          (v) => !this.form.departureFlightNumber || !!v || "Date is required",
        ],
        departureTime: [
          (v) => !this.form.departureFlightNumber || !!v || "Time is required",
        ],
      };
    },
  },
  watch: {
    flightDetails: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.populateForm(newVal);
      },
    },
  },
  methods: {
    ...mapMutations("transaction", ["SET_LOADING"]),
    populateForm(details = this.flightDetails) {
      this.form.firstName = details.firstName || "";
      this.form.lastName = details.lastName || "";
      this.form.arrivalFlightNumber = details.arrivalFlightNumber || "";
      this.form.arrivalDate = details.arrivalDate || "";
      this.form.arrivalTime = details.arrivalTime
        ? details.arrivalTime.slice(0, 5)
        : "";
      this.form.departureFlightNumber = details.departureFlightNumber || "";
      this.form.departureDate = details.departureDate || "";
      this.form.departureTime = details.departureTime
        ? details.departureTime.slice(0, 5)
        : "";
    },
    handleSubmit() {
      if (this.$refs.form.validate()) {
        const payload = {
          flightGroup: this.flightDetails.flightGroup,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
        };

        if (this.form.arrivalFlightNumber) {
          payload.arrivalFlightNumber = this.form.arrivalFlightNumber;
        }
        if (this.form.arrivalDate) {
          payload.arrivalDate = this.form.arrivalDate;
        }
        if (this.form.arrivalTime) {
          payload.arrivalTime = this.form.arrivalTime;
        }
        if (this.form.departureFlightNumber) {
          payload.departureFlightNumber = this.form.departureFlightNumber;
        }
        if (this.form.departureDate) {
          payload.departureDate = this.form.departureDate;
        }
        if (this.form.departureTime) {
          payload.departureTime = this.form.departureTime;
        }

        this.$emit("submit", payload);
      }
    },
  },
  created() {
    this.SET_LOADING({ key: "form", value: false });
  },
};
</script>

<style scoped>
.text-overline {
  font-size: 14px !important;
}

.col:not(:first-child):not(:last-child) {
  padding-top: 0 !important;
}
</style>
