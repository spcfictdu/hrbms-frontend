<template>
  <DialogTemplate
    :action="meta.action"
    :title="meta.actionType"
    maxWidth="450"
    :opened="opened"
    :onClose="onClose"
    @onSubmit="handleProceed"
  >
    <p class="text-caption text-sm-body-2 font-weight-regular">
      {{ meta.message }}
    </p>
    <v-card-actions class="pa-0 mt-4">
      <v-row dense>
        <v-col cols="12" sm="6" order="last" order-sm="first"
          ><v-btn text block color="warning" @click="onClose()"
            >Cancel</v-btn
          ></v-col
        >
        <v-col cols="12" sm="6"
          ><v-btn
            type="submit"
            text
            block
            color="primary"
            class="lightBg"
            :loading="loading"
            >{{ submitBtn }}</v-btn
          ></v-col
        >
      </v-row>
    </v-card-actions>
  </DialogTemplate>
</template>

<script>
import DialogTemplate from "./DialogTemplate.vue";
export default {
  name: "ConfirmationDialog",
  components: {
    DialogTemplate,
  },
  props: {
    opened: Boolean,
    onClose: Function,
    meta: Object,
    loading: Boolean,
    submitBtn: {
      type: String,
      default: "Proceed",
    },
  },
  data: () => ({}),
  methods: {
    handleProceed: function () {
      this.$emit("onProceed");
    },
  },
  computed: {},
};
</script>

<style scoped></style>
