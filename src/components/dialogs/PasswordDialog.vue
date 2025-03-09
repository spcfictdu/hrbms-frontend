<template>
  <DialogTemplate
    title="Change Password"
    maxWidth="600"
    :opened="opened"
    :onClose="onClose"
    @onSubmit="handlePasswordUpdate"
  >
    <!-- Alert -->
    <v-alert
      :value="alert"
      :type="alertType"
      dense
      class="w-full mt-2"
      transition="scroll-y-transition"
    >
      {{ alertMeta.message ?? alertMeta.message }}
    </v-alert>

    <FormField label="Old Password" class="mt-4 pb-4">
      <v-text-field
        type="password"
        dense
        outlined
        hide-details="auto"
        v-model="payload.oldPassword"
        :rules="rules.oldPassword"
      ></v-text-field>
    </FormField>

    <FormField label="New Password" class="pb-4">
      <v-text-field
        type="password"
        dense
        outlined
        hide-details="auto"
        v-model="payload.newPassword"
        :rules="rules.newPassword"
      ></v-text-field>
    </FormField>

    <FormField label="Confirm Password" class="pb-4">
      <v-text-field
        type="password"
        dense
        outlined
        hide-details="auto"
        v-model="payload.newPasswordConfirmation"
        :rules="rules.newPasswordConfirmation"
      ></v-text-field>
    </FormField>

    <v-card-actions class="pa-0 mt-4">
      <v-row dense>
        <v-col cols="12" sm="6" order="last" order-sm="first">
          <v-btn text block color="warning" @click="onClose()">Cancel</v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            text
            block
            color="primary"
            class="lightBg"
            type="submit"
            :loading="loading"
          >
            Save Changes
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </DialogTemplate>
</template>

<script>
import DialogTemplate from "./DialogTemplate.vue";
import FormField from "../fields/FormField.vue";
export default {
  name: "PasswordDialog",
  components: { DialogTemplate, FormField },
  props: {
    alertMeta: Object,
    opened: Boolean,
    onClose: Function,
    loading: Boolean,
  },
  data: () => ({
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
      this.$emit("onSubmit", this.payload);
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
    alert: function () {
      return this.alertMeta.status === "error" ? true : false;
    },
    alertType: function () {
      return "error";
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
    opened: {
      deep: true,
      handler: function (v) {
        if (!v) {
          this.resetPayload();
        }
      },
    },
  },
};
</script>

<style scoped></style>
