<template>
  <div>
    <v-alert
      :value="isShowAlert"
      :type="handleAlertType"
      class="w-full"
      transition="scroll-y-transition"
    >
      {{ alertStatus.message ?? alertStatus.message }}
    </v-alert>
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <label-slot>
            <template #label>First Name</template>
          </label-slot>
          <v-text-field
            background-color="white"
            dense
            outlined
            hide-details="auto"
            v-model="payload.firstName"
            :rules="rules.firstName"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <label-slot>
            <template #label>Middle Name</template>
          </label-slot>
          <v-text-field
            background-color="white"
            dense
            outlined
            hide-details="auto"
            v-model="payload.middleName"
            :rules="rules.middleName"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <label-slot>
            <template #label>Last Name</template>
          </label-slot>
          <v-text-field
            background-color="white"
            dense
            outlined
            hide-details="auto"
            v-model="payload.lastName"
            :rules="rules.lastName"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <label-slot>
            <template #label>Email</template>
          </label-slot>
          <v-text-field
            background-color="white"
            type="email"
            dense
            outlined
            hide-details="auto"
            v-model="payload.email"
            :rules="rules.email"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <label-slot>
            <template #label>Phone</template>
          </label-slot>
          <v-text-field
            background-color="white"
            counter="11"
            maxLength="11"
            type="tel"
            dense
            outlined
            hide-details="auto"
            v-mask="'###########'"
            v-model="payload.phoneNumber"
            :rules="rules.phoneNumber"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <label-slot>
            <template #label>Province</template>
          </label-slot>
          <v-text-field
            background-color="white"
            dense
            outlined
            hide-details="auto"
            v-model="payload.province"
            :rules="rules.province"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <label-slot>
            <template #label>City</template>
          </label-slot>
          <v-text-field
            background-color="white"
            dense
            outlined
            hide-details="auto"
            v-model="payload.city"
            :rules="rules.city"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <div
      class="mt-4 d-flex flex-column-reverse flex-sm-row justify-center justify-sm-end align-center"
    >
      <v-btn
        class="mr-0 mr-sm-4 mt-4 mt-sm-0"
        :block="$vuetify.breakpoint.xs"
        outlined
        color="primary"
        @click="handleCancelEvent"
        >Cancel
      </v-btn>
      <v-btn
        color="primary"
        :block="$vuetify.breakpoint.xs"
        @click="handleAccountUpdate"
        >Save Changes</v-btn
      >
    </div>
  </div>
</template>

<script>
import LabelSlot from "@/components/slots/LabelSlot.vue";
import { mask } from "vue-the-mask";
export default {
  name: "EditDetailsComponent",
  directives: { mask },
  components: { LabelSlot },
  props: { accountData: Object, alertStatus: Object },
  data: () => ({
    payload: {
      firstName: null,
      middleName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
      province: null,
      city: null,
    },
    isShowAlert: false,
  }),
  methods: {
    handleAccountUpdate: function () {
      if (this.$refs.form.validate()) {
        this.$emit("update-event", this.payload);
      }
    },
    resetPayload: function () {
      for (const key in this.payload) {
        if (Object.hasOwnProperty.call(this.payload, key)) {
          this.$set(this.payload, key, null);
        }
      }
      this.$refs.form.reset();
    },
    triggerAlert: function (value) {
      this.isShowAlert = value;
    },
    handleCancelEvent: function () {
      this.$emit('cancel-event');
    },
  },
  computed: {
    rules: function () {
      let errors = {};
      errors.firstName = [(v) => !!v || "First name is required"];
      errors.middleName = [];
      errors.lastName = [(v) => !!v || "Last name is required"];
      errors.email = [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ];
      errors.phoneNumber = [(v) => !!v || "Phone number is required"];
      errors.province = [];
      errors.city = [];
      return errors;
    },
    handleAlertType() {
      return this.alertStatus.status !== ""
        ? this.alertStatus.status.toLowerCase()
        : "error";
    },
  },
  watch: {
    accountData: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.payload = {
            firstName: newVal.firstName,
            middleName: newVal.middleName,
            lastName: newVal.lastName,
            email: newVal.email,
            phoneNumber: newVal.phone,
            province: newVal.address.province,
            city: newVal.address.city,
          };
        }
      },
    },
    alertStatus: {
      deep: true,
      handler: function (newVal) {
        if (
          newVal.status.toLowerCase() === "error" &&
          newVal.type.toLowerCase() === "details"
        ) {
          this.triggerAlert(true);
          let interval = setInterval(() => {
            this.triggerAlert(false);
            clearInterval(interval);
          }, 3000);
        }
      },
    },
  },
};
</script>

<style scoped></style>
