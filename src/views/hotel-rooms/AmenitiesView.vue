<template>
  <div>
    <RouteLoader :target="hasData" class="mt-10">
      <component
        :is="activeTab"
        :data="componentData"
        @request-event="handleRequest"
        @onSelect="selectedOption"
      />
    </RouteLoader>
    <AddDialog
      :opened="openedAddDialog"
      :onClose="() => setDialogFn({ key: openedDialogKey, value: false })"
      :meta="meta"
      :loading="loading.dialog"
      :message="dialog_message"
      @onSubmit="requestAction"
    />
    <DeleteDialog
      :opened="openedDeleteDialog"
      :onClose="
        () => {
          setActionToAdd();
          setDialogFn({ key: openedDialogKey, value: false });
        }
      "
      :loading="loading.dialog"
      :message="dialog_message"
      @onDelete="requestAction"
    />
  </div>
</template>

<script>
import AmenitiesComponent from "@/components/hotel-rooms/amenities/AmenitiesComponent.vue";
import AddOnsComponent from "@/components/hotel-rooms/amenities/AddOnsComponent.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import AddDialog from "@/components/dialogs/AddDialog.vue";
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "AmenitiesView",
  components: {
    AmenitiesComponent,
    AddOnsComponent,
    RouteLoader,
    AddDialog,
    DeleteDialog,
  },
  data: () => ({
    payload: {
      requestType: null,
    },

    // Dialog Meta
    meta: {
      action: "", // Add Amenity, Edit Amenity, Delete Amenity
      value: null,
    },

    dialogKeys: {
      add: "amenity_dialog",
      edit: "amenity_dialog",
      delete: "amenity_delete",
    },
  }),
  created() {
    this.fetch();
  },
  methods: {
    ...mapActions("amenities", [
      "fetchAmenities",
      "createAmenity",
      "updateAmenity",
      "deleteAmenity",
      "setLoading",
      "setSelectedAmenity",
    ]),
    ...mapActions("alerts", ["requireAlertFn"]),
    ...mapActions("dialogs", ["setDialogFn"]),
    ...mapActions("addOns", ["fetchAddOns"]),

    fetch: async function () {
      await this.fetchAmenities();
      await this.fetchAddOns();
    },
    handleRequest: async function (payload) {
      // Prefetch the alerts: success, error
      this.requireAlertFn(2);
      this.setLoading({ key: "dialog", value: true });

      // Designate Requests
      const requests = {
        add: () => this.createAmenity(payload.data),
        delete: () => this.deleteAmenity(payload.refNum),
        edit: () =>
          this.updateAmenity({
            refNum: payload.refNum,
            data: payload.data,
          }),
      };

      // Await the request
      if (requests[payload.requestType]) {
        await requests[payload.requestType]();
      }

      // Close the dialog and finish loading
      this.setLoading({ key: "dialog", value: false });
      this.setDialogFn({
        key: this.dialogKeys[payload.requestType],
        value: false,
      });
    },

    requestAction(requestData) {
      // Assign data to payload if action is Add or Edit
      if (["Add", "Edit"].includes(this.meta.action)) {
        this.payload.data = requestData;
      }
      this.handleRequest(this.payload);
      this.setSelectedAmenity(null);
    },

    resetMeta() {
      this.meta = {
        action: "",
        value: null,
      };
      this.payload = {
        requestType: null,
      };
    },

    selectedOption(option, refNum, amenityName) {
      const options = {
        edit: () => {
          this.meta = {
            action: "Edit",
            value: amenityName,
          };
          this.payload = {
            refNum,
            requestType: "edit",
          };
        },
        delete: () => {
          this.meta.action = "Delete";
          this.payload = {
            refNum,
            requestType: "delete",
          };
        },
      };

      if (options[option]) {
        this.setDialogFn({ key: this.dialogKeys[option], value: true });
        options[option]();
      }
    },
    setActionToAdd() {
      this.meta.action = "Add";
      this.payload.requestType = "add";
    },
  },
  computed: {
    ...mapState("dialogs", [
      "amenity_dialog",
      "amenity_delete",
      "addOn_dialog",
      "addOn_delete",
      "dialog_message",
    ]),
    ...mapGetters("dialogs", ["openedDialogKey"]),
    ...mapState("amenities", ["amenities", "activeAmenitiesTab", "loading"]),
    ...mapState("addOns", ["addOns"]),
    activeTab() {
      return this.activeAmenitiesTab === "Amenities"
        ? "AmenitiesComponent"
        : "AddOnsComponent";
    },
    componentData() {
      return this.activeTab === "AmenitiesComponent"
        ? this.amenities
        : this.addOns;
    },
    hasData: function () {
      return !!this.amenities ?? false;
    },
    openedAddDialog() {
      return this.amenity_dialog || this.addOn_dialog;
    },
    openedDeleteDialog() {
      return this.amenity_delete || this.addOn_delete;
    },
    message() {
      return this.dialog_message ?? "";
    },
  },
  watch: {
    amenity_dialog: {
      deep: true,
      handler: function (v) {
        if (v) {
          // console.log(this.meta.action);
          // if action is an empty string, set it to Add
          if (this.meta.action === "") {
            this.setActionToAdd();
          }
        } else {
          this.resetMeta();
        }
      },
    },
    addOn_dialog: {
      deep: true,
      handler: function (v) {
        if (v) {
          // if action is an empty string, set it to Add
          if (this.meta.action === "") {
            this.setActionToAdd();
          }
        } else {
          this.resetMeta();
        }
      },
    },
  },
};
</script>

<style scoped></style>
