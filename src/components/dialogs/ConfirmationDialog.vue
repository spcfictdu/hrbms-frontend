<template>
  <v-dialog max-width="450" v-model="dialog" overlay-opacity="0.2">
    <v-form ref="form">
      <v-card class="pa-8" rounded="lg" flat>
        <v-card-title
          class="transparent-bg text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-uppercase pa-0"
          >{{ metaDialog.action }} {{ metaDialog.actionType }}</v-card-title
        >
        <p class="py-2 py-sm-4 text-caption text-sm-body-2 font-weight-regular">
          {{ metaDialog.message }}?
        </p>
        <v-card-actions class="pa-0 mt-4">
          <v-row dense>
            <v-col cols="12" sm="6" order="last" order-sm="first"
              ><v-btn text block color="warning" @click="cancelButton"
                >Cancel</v-btn
              ></v-col
            >
            <v-col cols="12" sm="6"
              ><v-btn
                text
                block
                color="primary"
                class="lightBg"
                @click="proceedButton"
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
  name: "ConfirmationDialog",
  props: {
    activator: Boolean,
    metaDialog: Object,
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    cancelButton: function () {
      this.$emit("reset-activator");
    },
    proceedButton: function () {
      this.$emit("change-event");
    },
  },
  computed: {},
  watch: {
    activator: {
      handler: function (newVal) {
        this.dialog = newVal;
      },
    },
    dialog: {
      handler: function (newVal) {
        if (!newVal) {
          this.$emit("reset-activator");
        }
      },
    },
  },
};
</script>

<style scoped></style>
