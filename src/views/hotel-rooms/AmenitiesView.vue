<template>
  <RouteLoader :target="hasData" class="mt-10">
    <amenities-component
      :amenities="amenities"
      @request-event="handleRequest"
    />
  </RouteLoader>
</template>

<script>
import AmenitiesComponent from "@/components/hotel-rooms/amenities/AmenitiesComponent.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "AmenitiesView",
  components: { AmenitiesComponent, RouteLoader },
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
    fetch: async function () {
      await this.fetchAmenities();
    },
    handleRequest: async function (payload) {
      console.log("TEST", payload.requestType);
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
    ...mapState("amenities", ["amenities"]),
    hasData: function () {
      return !!this.amenities ?? false;
    },
  },
};
</script>

<style scoped></style>
