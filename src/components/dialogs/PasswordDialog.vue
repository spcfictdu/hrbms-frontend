<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-form ref="form" lazy-validation>
      <v-card class="pa-8" rounded="lg" flat>
        <v-card-title
          class="transparent-bg text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-uppercase pa-0"
          >Change Password
        </v-card-title>

        <!-- Alert -->
        <v-alert
          :value="isShowAlert"
          :type="handleAlertType"
          dense
          class="w-full mt-2"
          transition="scroll-y-transition"
        >
          {{ alertStatus.message ?? alertStatus.message }}
        </v-alert>

        <div class="mt-4 pb-4">
          <label-slot>
            <template #label>Old Password</template>
          </label-slot>
          <v-text-field
            type="password"
            dense
            outlined
            hide-details="auto"
            v-model="payload.oldPassword"
            :rules="rules.oldPassword"
          ></v-text-field>
        </div>

        <div class="pb-4">
          <label-slot>
            <template #label>New Password</template>
          </label-slot>
          <v-text-field
            type="password"
            dense
            outlined
            hide-details="auto"
            v-model="payload.newPassword"
            :rules="rules.newPassword"
          ></v-text-field>
        </div>

        <div class="pb-4">
          <label-slot>
            <template #label>Confirm Password</template>
          </label-slot>
          <v-text-field
            type="password"
            dense
            outlined
            hide-details="auto"
            v-model="payload.newPasswordConfirmation"
            :rules="rules.newPasswordConfirmation"
          ></v-text-field>
        </div>

        <v-card-actions class="pa-0 mt-4">
          <v-row dense>
            <v-col cols="12" sm="6" order="last" order-sm="first">
              <v-btn text block color="warning">Cancel </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                text
                block
                color="primary"
                class="lightBg"
                @click="handlePasswordUpdate"
                >Save Changes
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import LabelSlot from "@/components/slots/LabelSlot.vue";
export default {
  name: "PasswordDialog",
  props: { alertStatus: Object, passwordDialog: Boolean },
  components: { LabelSlot },
  data: () => ({
    dialog: false,
    isShowAlert: false,
    payload: {
      oldPassword: null,
      newPassword: null,
      newPasswordConfirmation: null,
    },
  }),
  methods: {
    triggerAlert: function (value) {
      this.isShowAlert = value;
    },
    handlePasswordUpdate: function () {
      if (this.$refs.form.validate()) {
        this.$emit("password-event", this.payload);
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
  },
  computed: {
    handleAlertType() {
      return this.alertStatus.status !== ""
        ? this.alertStatus.status.toLowerCase()
        : "error";
    },
    rules: function () {
      let errors = {};
      (errors.oldPassword = [(v) => !!v || "Old password is required"]),
        (errors.newPassword = [
          (v) => !!v || "New password is required",
          (v) => (v && v.length >= 8) || "Must be at least 8 characters",
        ]),
        (errors.newPasswordConfirmation = [
          (v) => v === this.payload.newPassword || "Passwords must match",
        ]);
      return errors;
    },
  },
  watch: {
    alertStatus: {
      deep: true,
      handler: function (newVal) {
        if (
          newVal.type?.toLowerCase() === "password" &&
          newVal.status?.toLowerCase() === "error"
        ) {
          this.triggerAlert(true);
          let interval = setInterval(() => {
            this.triggerAlert(false);
            clearInterval(interval);
          }, 3000);
        }
      },
    },
    dialog: {
      deep: true,
      handler: function (newVal) {
        // Reset Vuex Store
        if (!newVal) {
          this.$emit("reset-dialog", newVal);
          this.resetPayload();
        }
      },
    },
    passwordDialog: {
      handler: function (newVal) {
        this.dialog = newVal;
      },
    },
  },
};
</script>

<style scoped></style>
