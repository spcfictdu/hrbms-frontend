<template>
  <div>
    <RouteLoader :target="hasData" class="mt-10">
      <component
        :is="activeTab"
        :data="componentData"
        @onSelect="selectedOption"
      />
    </RouteLoader>
    <AddDialog
      :opened="amenity_dialog"
      :onClose="() => handleClose('amenity_dialog')"
      :meta="meta"
      :loading="loading.dialog"
      :message="dialog_message"
      @onSubmit="requestAction"
    />
    <DeleteDialog
      :opened="amenity_delete"
      :onClose="() => handleClose('amenity_delete')"
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
import { mapActions, mapState } from "vuex";
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
    // Dialog Meta
    meta: {
      action: "", // Add, Edit, Delete
      name: null,
      price: null,
      refNum: null,
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
    ...mapActions("addOns", [
      "fetchAddOns",
      "createAddOn",
      "updateAddOn",
      "deleteAddOn",
    ]),

    fetch: async function () {
      await this.fetchAmenities();
      await this.fetchAddOns();
    },
    handleRequest: async function ({ name, price, refNum, action }) {
      // Prefetch the alerts: success, error
      this.requireAlertFn(2);
      this.setLoading({ key: "dialog", value: true });

      // Designate Requests
      const amenityRequests = {
        add: () => this.createAmenity({ name, price }),
        delete: () => this.deleteAmenity(refNum),
        edit: () =>
          this.updateAmenity({
            refNum,
            data: { name, price },
          }),
      };
      const addOnRequests = {
        add: () => this.createAddOn({ name, price }),
        delete: () => this.deleteAddOn(refNum),
        edit: () =>
          this.updateAddOn({
            refNum,
            data: { name, price },
          }),
      };

      const requests =
        this.dialog_message === "Amenity" ? amenityRequests : addOnRequests;

      // Await the request
      if (requests[action]) {
        await requests[action]();
      }

      // Close the dialog and finish loading
      this.setLoading({ key: "dialog", value: false });
      this.setDialogFn({
        key: this.key(action),
        value: false,
      });
    },

    requestAction(requestData) {
      // Assign data to payload if action is Add or Edit
      if (["add", "edit"].includes(this.meta.action)) {
        this.meta.name = requestData.name;
        this.meta.price = requestData.price;
      }
      this.handleRequest(this.meta);
      this.setSelectedAmenity(null);
    },

    resetMeta() {
      this.meta = {
        action: "",
        name: null,
        price: null,
        refNum: null,
      };
    },

    selectedOption(option, refNum, name, price) {
      const options = {
        edit: () => {
          this.meta = {
            action: "edit",
            name,
            price,
            refNum,
          };
        },
        delete: () => {
          this.meta = {
            action: "delete",
            refNum,
          };
        },
      };

      if (options[option]) {
        this.setDialogFn({ key: this.key(option), value: true });
        options[option]();
      }
    },

    key(option) {
      return this.dialog_message === "Amenity"
        ? this.dialogKeys[option]
        : this.dialogKeys[option];
    },

    handleClose(dialog) {
      this.resetMeta();
      this.setDialogFn({ key: dialog, value: false });
    },
  },
  computed: {
    ...mapState("dialogs", [
      "amenity_dialog",
      "amenity_delete",
      "dialog_message",
    ]),
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
  },
  watch: {
    amenity_dialog: {
      deep: true,
      handler: function (v) {
        if (v) {
          // if action is an empty string, set it to Add
          if (this.meta.action === "") {
            this.meta.action = "add";
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
