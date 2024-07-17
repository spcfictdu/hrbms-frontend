<template>
  <div>
    <div class="d-flex flex-row">
      <div class="d-flex flex-column">
        <div :class="classGuestName">
          {{ guest.fullName }}
        </div>
        <div
          class="d-flex flex-column flex-sm-row justify-start text-caption text-md-subtitle-1 address--text"
        >
          <div class="mr-5">
            <span class="span-style">Address:</span> {{ guest.city }},
            {{ guest.province }}
          </div>
          <div class="mr-5">
            <span class="span-style">Email:</span> {{ guest.email }}
          </div>
          <div class="mr-5">
            <span class="span-style">Phone:</span> {{ guest.phone }}
          </div>
          <div class="mr-5">
            <span class="span-style">ID Number:</span> {{ guest.idNumber }}
          </div>
        </div>
      </div>
      <v-spacer/>
      <div class="d-flex flex-column" v-if="!$vuetify.breakpoint.xs">
        <v-btn outlined color="red" @click="triggerActivator"
          >DELETE GUEST DETAILS</v-btn
        >
      </div>
      <div v-else class="d-flex flex-row justify-end flex-grow-1">
        <v-btn
          icon
          outlined
          color="red"
          @click="triggerActivator"
          ><v-icon>mdi-trash-can-outline</v-icon></v-btn
        >
      </div>
    </div>
    <DeleteDialog
      :activator="metaDialog.deleteActivator"
      :deleteMeta="metaDialog"
      @reset-activator="resetActivator"
      @delete-event="deleteRequest"
    />
  </div>
</template>

<script>
import DeleteDialog from "../dialogs/DeleteDialog.vue";

export default {
  name: "GuestInfo",
  components: { DeleteDialog },
  props: {
    guest: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    classGuestName: "",
    metaDialog: {},
  }),
  methods: {
    deleteRequest: function () {
      this.$emit("delete-request", this.guest.id);
    },
    triggerActivator: function () {
      this.metaDialog = {
        targetDeletion: "guest",
        deleteActivator: true,
      };
    },
    resetActivator: function () {
      this.metaDialog = {};
    },
  },
  computed: {
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },
  watch: {
    size: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (newVal.xs) {
          this.classGuestName = "font-weight-bold text-body-1 mt-n3";
        } else {
          this.classGuestName = "text-h6 font-weight-bold mb-2";
        }
      },
    },
  },
};
</script>

<style scoped>
.address--text {
  color: #555555;
}

.span-style {
  text-transform: uppercase;
  font-weight: bold;
}
</style>
