<template>
  <v-dialog v-model="dialog" max-width="600" overlay-opacity="0.2">
    <v-form ref="amenityForm">
      <v-card class="pa-8" rounded="lg" flat>
        <v-card-title
          class="transparent-bg text-subtitle-1 font-weight-bold text-uppercase pa-0"
          >{{ metaDialog.action }}</v-card-title
        >
        <div class="mt-4 mb-8">
          <div class="text-caption ml-1 mb-1">Amenity Name</div>
          <v-text-field
            v-model="payload.name"
            outlined
            dense
            :rules="validate.amenityName"
            hide-details="auto"
          ></v-text-field>
        </div>

        <v-card-actions class="pa-0">
          <v-row dense>
            <v-col cols="6">
              <v-btn
                text
                color="housekeeping"
                block
                max-width="50%"
                @click="cancelButton"
                >Cancel</v-btn
              >
            </v-col>
            <v-col cols="6"
              ><v-btn
                text
                color="primary"
                block
                max-width="50%"
                class="lightBg"
                @click="submitButton"
                >Proceed</v-btn
              ></v-col
            >
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: "AmenityDialog",
  data: () => ({
    payload: {
      name: "",
    },
    dialog: false,
  }),
  props: {
    activator: Boolean,
    metaDialog: Object,
  },
  computed: {
    validate() {
      const errors = {};
      errors.amenityName = [(v) => !!v || "Amenity Name is required"];
      return errors;
    },
  },
  methods: {
    cancelButton: function () {
      this.$refs.amenityForm.reset();
      this.$emit("reset-activator");
    },
    submitButton: function () {
      if (this.$refs.amenityForm.validate()) {
        this.$emit("amenity-request", this.payload);
        this.$refs.amenityForm.reset();
      }
    },
  },
  watch: {
    activator: {
      deep: true,
      handler: function (value) {
        this.dialog = value;
        if (this.metaDialog.action === "Edit Amenity") {
          this.payload.name = this.metaDialog.amenityName;
        }
      },
    },
    dialog: {
      deep: true,
      handler: function (value) {
        if (!value) {
          this.$emit("reset-activator");
        }
      },
    },
  },
};
</script>

<style scoped></style>
