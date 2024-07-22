<template>
  <v-dialog max-width="450" v-model="dialog" overlay-opacity="0.2">
    <v-card class="pa-8" rounded="lg" flat>
      <v-card-title
        class="transparent-bg text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-uppercase pa-0"
        >Delete Confirmation</v-card-title
      >
      <p class="py-2 py-sm-4 text-caption text-sm-body-2 font-weight-regular">
        Permanently delete {{ deleteMeta.targetDeletion }}? This action cannot
        be undone.
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
              :loading="metaLoading?.title ? metaLoading.loading : false"
              @click="deleteButton"
              >Proceed</v-btn
            ></v-col
          >
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DeleteDialog",
  data: () => ({
    dialog: false,
  }),
  props: {
    activator: {
      type: Boolean,
    },
    deleteMeta: {
      type: Object,
    },
    metaLoading: Object
  },
  computed: {
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },
  methods: {
    cancelButton: function () {
      this.$emit("reset-activator");
    },
    deleteButton: function () {
      this.$emit("delete-event");
    },
  },
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

<style scoped>
.transparent-bg {
  background-color: transparent !important;
}
</style>
