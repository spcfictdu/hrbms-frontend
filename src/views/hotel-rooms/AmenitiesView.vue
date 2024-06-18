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
      @delete-event="deleteEvent"
      @update-event="updateEvent"
    />
  </div>
</template>

<script>
import AmenitiesComponent from "@/components/hotel-rooms/amenities/AmenitiesComponent.vue";
import { mapActions, mapState } from "vuex";

export default {
  components: { AmenitiesComponent },
  name: "AmenitiesView",
  data: () => ({
    hello: "world",
    components: { AmenitiesComponent },
    alert: false,
    status: "",
  }),
  methods: {
    ...mapActions("amenities", [
      "fetchAmenities",
      "createAmenity",
      "updateAmenity",
      "deleteAmenity",
    ]),
    deleteEvent: function (referenceNumber) {
      this.deleteAmenity(referenceNumber);
      referenceNumber = null;
    },
    updateEvent: function ({ payload, referenceNum }) {
      this.updateAmenity({
        refNum: referenceNum,
        data: payload,
      });
      payload = null;
      referenceNum = null;
    },
    triggerAlert: function (value) {
      this.alert = value;
    },
  },
  computed: {
    ...mapState("amenities", {
      amenities: "amenities",
      procedureStatus: "procedureStatus",
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
          let interval = setInterval(() => {
            this.triggerAlert(false);
            clearInterval(interval);
          }, 3000);
        }
      },
    },
  },
};
</script>

<style scoped></style>
