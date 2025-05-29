<template>
  <DialogTemplate
    :opened="opened"
    :onClose="onClose"
    :action="meta.action"
    :title="message"
    maxWidth="600"
    @onSubmit="handleSubmit"
  >
    <FormField :label="`${this.message} Name`" class="mb-4">
      <v-text-field
        v-model="payload.name"
        outlined
        dense
        :rules="rules.inputName"
        hide-details="auto"
      ></v-text-field>
    </FormField>

    <FormField
      v-if="message === 'Add-on'"
      :label="`${this.message} Price`"
      class="mb-4"
    >
      <v-text-field
        v-model="payload.price"
        outlined
        dense
        :rules="rules.addOnPrice"
        hide-details="auto"
      ></v-text-field>
    </FormField>

    <v-card-actions class="pa-0">
      <v-row dense>
        <v-col cols="6">
          <v-btn text color="error" block @click="onClose()">Cancel</v-btn>
        </v-col>
        <v-col cols="6"
          ><v-btn
            text
            color="primary"
            block
            class="lightBg"
            :loading="loading"
            type="submit"
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
export default {
  name: "AddDialog",
  components: { DialogTemplate, FormField },
  props: {
    message: String,
    opened: Boolean,
    onClose: Function,
    meta: Object,
    loading: Boolean,
  },
  data: () => ({
    payload: {
      name: "",
      price: "",
    },
  }),
  computed: {
    rules: function () {
      const errors = {};
      errors.inputName = [(v) => !!v || `${this.message} Name is required`];
      errors.addOnPrice = [(v) => !isNaN(v) || "Please enter a valid number."];
      return errors;
    },
  },
  methods: {
    handleSubmit: function () {
      this.$emit("onSubmit", this.payload);
    },
  },
  watch: {
    opened: {
      immediate: true,
      handler: function (v) {
        if (v && this.meta.action === "Edit") {
          this.payload.name = this.meta.name;
          this.payload.price = this.meta.price;
        } else {
          this.payload.name = "";
          this.payload.price = "";
        }
      },
    },
  },
};
</script>
