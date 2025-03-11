<template>
  <DialogTemplate
    :opened="opened"
    :onClose="onClose"
    :action="meta.action"
    title="Amenity"
    maxWidth="600"
    @onSubmit="handleSubmit"
  >
    <FormField label="Amenity Name" class="mb-4">
      <v-text-field
        v-model="payload.name"
        outlined
        dense
        :rules="rules.amenityName"
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
  name: "AmenityDialog",
  components: { DialogTemplate, FormField },
  props: {
    opened: Boolean,
    onClose: Function,
    meta: Object,
    loading: Boolean,
  },
  data: () => ({
    payload: {
      name: "",
    },
  }),
  computed: {
    rules: function () {
      const errors = {};
      errors.amenityName = [(v) => !!v || "Amenity Name is required"];
      return errors;
    },
  },
  methods: {
    handleSubmit: function () {
      this.$emit("amenity-request", this.payload);
    },
  },
  watch: {
    opened: {
      immediate: true,
      handler: function (v) {
        if (v && this.meta.action === "Edit") {
          this.payload.name = this.meta.value;
        }
      },
    },
  },
};
</script>

<style scoped></style>
