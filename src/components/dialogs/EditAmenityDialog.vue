<template>
  <v-dialog v-model="isShow" max-width="600" overlay-opacity="0.2">
    <v-form ref="editAmenityForm">
      <v-card class="pa-8" rounded="lg" flat>
        <v-card-title
          class="transparent-bg text-subtitle-1 font-weight-bold text-uppercase pa-0"
          >Edit Amenity</v-card-title
        >
        <div class="my-8">
          <div class="text-caption ml-1 mb-1">Amenity Name</div>
          <v-text-field
            v-model="amenityName"
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
  name: "EditAmenityDialog",
  data: () => ({
    amenityName: "",
  }),
  props: {
    activator: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    isShow: function () {
      return this.activator;
    },
    validate() {
      const errors = {};
      errors.amenityName = [(v) => !!v || "Amenity Name is required"];
      return errors;
    },
  },
  methods: {
    cancelButton: function () {
      this.$refs.editAmenityForm.reset();
      this.$emit("reset-activator");
    },
    submitButton: function () {
      if (this.$refs.editAmenityForm.validate()) {
        this.$emit("update-request", this.amenityName);
        this.$refs.editAmenityForm.reset();
        this.amenityName = "";
      }
    },
  },
};
</script>

<style scoped></style>
