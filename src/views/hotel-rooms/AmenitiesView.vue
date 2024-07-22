<template>
  <div class="mt-10">
    <v-alert
      :value="alert"
      :type="status"
      class="w-full"
      transition="scroll-y-transition"
    >
      {{ procedureStatus.message }}
    </v-alert>
    <amenities-component
      :amenities="amenities"
      :amenityDialog="amenityDialog"
      :metaLoading="meta"
      @request-event="requestEvent"
      @close-dialog="closeAmenityDialog"
    />
  </div>
</template>

<script>
import AmenitiesComponent from "@/components/hotel-rooms/amenities/AmenitiesComponent.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "AmenitiesView",
  components: { AmenitiesComponent },
  data: () => ({
    alert: false,
    status: null,
  }),
  methods: {
    ...mapActions("amenities", [
      "fetchAmenities",
      "createAmenity",
      "updateAmenity",
      "deleteAmenity",
      "triggerAmenityDialog",
      "triggerLoading",
    ]),
    requestEvent: function (payload) {
      switch (payload.requestType) {
        case "Add Amenity":
          this.triggerLoading(true);
          this.createAmenity(payload.data);
          break;
        case "Delete Amenity":
          this.triggerLoading(true);
          this.deleteAmenity(payload.refNum);
          break;
        case "Edit Amenity":
          this.triggerLoading(true);
          this.updateAmenity({
            refNum: payload.refNum,
            data: payload.data,
          });
      }
    },
    triggerAlert: function (value) {
      this.alert = value;
    },
    closeAmenityDialog: function () {
      this.triggerAmenityDialog(false);
    },
  },
  computed: {
    ...mapState("amenities", {
      amenities: "amenities",
      procedureStatus: "procedureStatus",
      amenityDialog: "amenityDialog",
      meta: "meta",
    }),
  },
  created() {
    this.fetchAmenities();
  },
  watch: {
    procedureStatus: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (newVal.status !== "") {
          this.status = newVal.status;
          this.triggerAlert(true);
          setTimeout(() => {
            this.triggerAlert(false);
            newVal.status = "";
          }, 3000);
        }
      },
    },
  },
};
</script>

<style scoped></style>
