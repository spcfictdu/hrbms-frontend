<template>
  <DialogTemplate
    :opened="opened"
    :onClose="onClose"
    action="Delete"
    title="Confirmation"
    maxWidth="450"
  >
    <p class="mb-4 text-caption text-sm-body-2 font-weight-regular">
      Permanently delete {{ message }}? This action cannot be undone.
    </p>
    <v-card-actions class="pa-0">
      <v-row dense>
        <v-col cols="12" sm="6" order="last" order-sm="first"
          ><v-btn text block color="warning" @click="handleCancel"
            >Cancel</v-btn
          ></v-col
        >
        <v-col cols="12" sm="6"
          ><v-btn
            text
            block
            color="primary"
            class="lightBg"
            :loading="loading"
            @click="handleDelete"
            >Proceed</v-btn
          ></v-col
        >
      </v-row>
    </v-card-actions>
  </DialogTemplate>
</template>

<script>
import DialogTemplate from "./DialogTemplate.vue";
export default {
  name: "DeleteDialog",
  components: { DialogTemplate },
  props: {
    opened: Boolean,
    onClose: Function,
    message: String,
    loading: Boolean,
  },
  data: () => ({}),
  methods: {
    handleCancel: function () {
      this.onClose();
    },
    handleDelete: function () {
      this.$emit("onDelete");
    },
  },
};
</script>

<style scoped></style>
