<template>
  <DialogTemplate
    title="Change Password"
    maxWidth="600"
    :opened="opened"
    :onClose="onClose"
    @onSubmit="handleSubmit"
  >
    <p v-if="meta" class="text-caption text-sm-body-2 font-weight-regular mb-0">
      {{ meta.fullName }} ({{ meta.username }})
    </p>

    <FormField label="New Password" class="mt-4 pb-4">
      <v-text-field
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        dense
        outlined
        hide-details="auto"
        v-model="payload.newPassword"
        :rules="rules.newPassword"
      ></v-text-field>
    </FormField>

    <FormField label="Confirm Password" class="pb-4">
      <v-text-field
        :type="showConfirmation ? 'text' : 'password'"
        :append-icon="showConfirmation ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showConfirmation = !showConfirmation"
        dense
        outlined
        hide-details="auto"
        v-model="payload.newPassword_confirmation"
        :rules="rules.newPassword_confirmation"
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
  name: "UserPasswordDialog",
  components: { DialogTemplate, FormField },
  props: {
    opened: Boolean,
    onClose: Function,
    loading: Boolean,
    meta: Object,
  },
  data: () => ({
    showPassword: false,
    showConfirmation: false,
    payload: {
      newPassword: null,
      newPassword_confirmation: null,
    },
  }),
  methods: {
    handleSubmit() {
      this.$emit("onSubmit", { ...this.payload });
    },
    resetPayload() {
      this.payload.newPassword = null;
      this.payload.newPassword_confirmation = null;
      this.showPassword = false;
      this.showConfirmation = false;
    },
  },
  computed: {
    rules() {
      return {
        newPassword: [
          (v) => !!v || "New password is required",
          (v) => (v && v.length >= 8) || "Must be at least 8 characters",
        ],
        newPassword_confirmation: [
          (v) => !!v || "Please confirm the new password",
          (v) => v === this.payload.newPassword || "Passwords must match",
        ],
      };
    },
  },
  watch: {
    opened: {
      handler: function (v) {
        if (!v) this.resetPayload();
      },
    },
  },
};
</script>

<style scoped></style>
