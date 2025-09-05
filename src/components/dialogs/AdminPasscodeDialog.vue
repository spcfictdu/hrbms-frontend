<template>
  <DialogTemplate
    :opened="opened"
    :onClose="onClose"
    :action="meta.action"
    titleClasses="primary--text"
    title="Enter Admin Passcode"
    maxWidth="400"
    @onSubmit="handleProceed"
  >
    <FormField class="mb-4">
      <v-text-field
        autofocus
        v-model="passcodeInput"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show ? 'text' : 'password'"
        name="passcode"
        outlined
        dense
        :rules="[(v) => !!v || 'Admin passcode is required']"
        hide-details="auto"
        @click:append="show = !show"
      ></v-text-field>
    </FormField>

    <v-card-actions class="pa-0">
      <v-row dense>
        <v-col cols="6">
          <v-btn text color="error" block @click="onClose()">Cancel</v-btn>
        </v-col>
        <v-col cols="6"
          ><v-btn text color="primary" block class="lightBg" type="submit"
            >Proceed</v-btn
          ></v-col
        >
      </v-row>
    </v-card-actions>
  </DialogTemplate>
</template>

<script>
import DialogTemplate from "./DialogTemplate.vue";
import FormField from "../fields/FormField.vue";
import { mapActions } from "vuex";

export default {
  name: "AdminPasscodeDialog",
  components: { DialogTemplate, FormField },
  props: {
    opened: Boolean,
    onClose: Function,
    meta: Object,
  },
  data: () => ({
    show: false,
    adminPasscode: "12345",
    passcodeInput: "",
  }),
  methods: {
    ...mapActions("alerts", ["requireAlertFn", "triggerError"]),

    handleProceed() {
      const valid = this.passcodeInput === this.adminPasscode;

      if (!valid) {
        this.requireAlertFn(2);
        this.triggerError("Incorrect password");
      } else {
        this.$emit("valid");
      }

      this.passcodeInput = "";
      this.onClose();
    },
  },
};
</script>
