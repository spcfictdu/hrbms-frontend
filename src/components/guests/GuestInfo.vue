<template>
  <div>
    <v-row>
      <v-col cols="11" sm="8">
        <div :class="classGuestName">
          {{ guest.fullName }}
        </div>
      </v-col>
      <v-col cols="4" v-if="!$vuetify.breakpoint.xs" class="d-flex justify-end">
        <v-btn outlined color="red" @click="triggerActivator"
          >DELETE GUEST DETAILS</v-btn
        >
      </v-col>
      <v-col cols="auto" v-else class="relative-position">
        <v-btn
          icon
          outlined
          color="red"
          @click="triggerActivator"
          class="absolute-position"
          ><v-icon>mdi-trash-can-outline</v-icon></v-btn
        >
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <v-row>
      <v-col class="text-body-2">
        <span class="font-weight-bold grey--text" cols="12" sm="6" lg="3"
          >ADDRESS:</span
        >
        {{ guest.city }}, {{ guest.province }}</v-col
      >
      <v-col class="text-body-2" cols="12" sm="6" lg="3"
        ><span class="font-weight-bold grey--text">EMAIL:</span>
        {{ guest.email }}</v-col
      >
      <v-col class="text-body-2" cols="12" sm="6" lg="3"
        ><span class="font-weight-bold grey--text">PHONE:</span>
        {{ guest.phone }}</v-col
      >
      <v-col class="text-body-2" cols="12" sm="6" lg="3"
        ><span class="font-weight-bold grey--text">ID NUMBER:</span>
        {{ guest.idNumber }}</v-col
      >
    </v-row>
    <DeleteDialog
      :activator="metaDialog.deleteActivator"
      :deleteMeta="metaDialog"
      @reset-activator="resetActivator"
      @delete-event="deleteRequest"
    />
  </div>
</template>

<script>
import DeleteDialog from '../dialogs/DeleteDialog.vue';

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
      this.metaDialog = {}
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
          this.classGuestName =
            "font-weight-bold text-body-2 mt-n3";
        } else {
          this.classGuestName = "text-h6 font-weight-bold";
        }
      },
    },
  },
};
</script>

<style scoped>
.absolute-position {
  position: absolute;
}

.relative-position {
  position: relative;
  right: 40px;
  top: -15px;
}
</style>
