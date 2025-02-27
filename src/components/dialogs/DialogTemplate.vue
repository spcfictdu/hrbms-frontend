<template>
  <v-dialog v-model="dialog" :max-width="maxWidth" overlay-opacity="0.2">
    <v-card class="pa-8" rounded="lg" flat>
      <DialogToolbar
        class="mb-4"
        :title="action ? `${action} ${title}` : title"
        @onClose="dialog = false"
      />
      <v-form ref="form" @submit.prevent="handleForm">
        <slot />
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogToolbar from "../toolbars/DialogToolbar.vue";
export default {
  name: "DialogTemplate",
  components: {
    DialogToolbar,
  },
  props: {
    maxWidth: String,
    action: String,
    title: String,
    opened: Boolean,
    onClose: Function,
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    handleForm: function () {
      if (this.$refs.form.validate()) {
        this.$emit("onSubmit");
      }
    },
    resetValidation: function () {
      if (this.$refs.form) this.$refs.form.resetValidation();
    },
  },
  watch: {
    opened: {
      handler: function (v) {
        this.dialog = v;

        this.$nextTick(() => {
          if (this.$refs.form) {
            this.resetValidation();
          }
        });
      },
    },
    dialog: {
      handler: function (v) {
        if (!v) {
          this.onClose();
        }
      },
    },
  },
};
</script>

<style scoped></style>
