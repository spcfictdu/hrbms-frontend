<template>
  <v-dialog max-width="400" v-model="isShow" overlay-opacity="0.2">
    <v-card class="pa-5" rounded="lg" flat>
      <!-- <v-card-title class="text-subtitle-1 font-weight-bold text-uppercase pa-0"
        >Delete</v-card-title
      > -->
      <div>
        <div class="d-flex justify-center ma-3">
          <v-icon color="warning" size="150">mdi-delete-alert</v-icon>
        </div>
        <div :class="title">You are about to delete a record</div>
        <div class="text-body-2 d-flex justify-center font-weight-medium">
          This action cannot be undone
        </div>
        <div class="text-body-2 d-flex justify-center font-weight-medium">
          Are you sure?
        </div>
        <div class="ma-3">
          <v-row>
            <v-col cols="6"
              ><v-btn text block @click="cancelButton">Cancel</v-btn></v-col
            >
            <v-col cols="6"
              ><v-btn color="warning" block @click="deleteButton" dark
                >Delete</v-btn
              ></v-col
            >
          </v-row>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "DeleteDialog",
  data: () => ({
    title: "ma-1 text-h6 font-weight-bold d-flex justify-center",
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
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },
  methods: {
    ...mapActions("guest", ["deleteGuest"]),
    cancelButton: function () {
      this.$emit("reset-activator");
    },
    deleteButton: function () {
      this.$emit("delete-guest");
    },
  },
  watch: {
    size: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.xs) {
          this.title =
            "ma-1 text-subtitle-1 font-weight-bold d-flex justify-center";
        } else {
          this.title = "ma-1 text-h6 font-weight-bold d-flex justify-center";
        }
      },
    },
  },
};
</script>

<style scoped></style>
