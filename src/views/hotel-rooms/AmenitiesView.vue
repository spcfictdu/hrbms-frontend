<template>
  <RouteLoader :target="hasData" class="mt-10">
    <component
      :is="activeTab"
      :data ="data"
      @request-event="handleRequest"
    />
  </RouteLoader>
</template>

<script>
import AmenitiesComponent from "@/components/hotel-rooms/amenities/AmenitiesComponent.vue";
import AddOnsComponent from "@/components/hotel-rooms/amenities/AddOnsComponent.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "AmenitiesView",
  components: { AmenitiesComponent, AddOnsComponent, RouteLoader },
  data: () => ({
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
  },
  computed: {
    ...mapState("amenities", ["amenities", "activeAmenitiesTab"]),
    ...mapState('addOns', ['addOns']),
    activeTab() {
      return this.activeAmenitiesTab === "Amenities" ? "AmenitiesComponent" : "AddOnsComponent"
    },
    data() {
      return this.activeTab === "AmenitiesComponent" ? this.amenities : this.addOns;
    },
    hasData: function () {
      return !!this.amenities ?? false;
    },
  },
};
</script>

<style scoped></style>
