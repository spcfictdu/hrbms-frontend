<template>
  <RouteLoader :target="hasData" class="mt-10">
    <v-row>
      <v-col cols="12">
        <RoomImages :images="roomImages" />
      </v-col>
      <v-col cols="12">
        <RoomDetails
          :category="roomCategory"
          @reservation-event="requestReservation"
          @validation-event="assessRequestCall"
          @delete-event="deleteRequestCategory"
        />
      </v-col>
    </v-row>
  </RouteLoader>
</template>

<script>
import RoomImages from "@/components/layouts/images/RoomImages.vue";
import RoomDetails from "@/components/layouts/sections/RoomDetails.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "RoomDetailsView",
  components: { RoomImages, RoomDetails, RouteLoader },
  data: () => ({
    referenceNumber: null,
  }),
  methods: {
    ...mapActions("roomCategories", [
      "fetchRoomCategory",
      "deleteRoomCategory",
      "resetRoomCategory",
      "triggerLoading",
    ]),
    ...mapActions("roomRates", [
      "createSpecialRoomRate",
      "deleteSpecialRoomRate",
      "updateRegularRoomRate",
      "updateSpecialRoomRate",
      "triggerRateLoading",
    ]),
    // API Calls
    fetchRoomCategoryMethod: function () {
      this.referenceNumber = this.$route.params.roomCategoryReferenceNumber;
      this.fetchRoomCategory({
        roomTypeReferenceNumber: this.referenceNumber,
      });
    },
    assessRequestCall: function (payload) {
      let newVal = { ...payload };

      if (payload.status === "ADD" && payload.type === "SPECIAL") {
        // Delete Values
        delete newVal.status;
        delete newVal.type;

        this.triggerRateLoading({
          title: "Create Special Room Rate",
          loading: true,
        }).then(() => {
          this.createSpecialRoomRate({
            payload: newVal,
            roomTypeReferenceNumber: this.referenceNumber,
          });
        });
      } else if (payload.status === "DELETE" && payload.type === "SPECIAL") {
        this.triggerRateLoading({
          title: "Delete Special Room Rate",
          loading: true,
        }).then(() => {
          this.deleteSpecialRoomRate({
            roomTypeReferenceNumber: this.referenceNumber,
            roomTypeRateReferenceNumber: payload.referenceNumber,
          });
        });
      } else if (payload.status === "UPDATE" && payload.type === "REGULAR") {
        // Delete Values
        delete newVal.status;
        delete newVal.type;
        delete newVal.referenceNumber;

        this.triggerRateLoading({
          title: "Update Regular Room Rate",
          loading: true,
        }).then(() => {
          this.updateRegularRoomRate({
            roomTypeReferenceNumber: this.referenceNumber,
            roomTypeRateReferenceNumber: payload.referenceNumber,
            payload: newVal,
          });
        });
      } else if (payload.status === "UPDATE" && payload.type === "SPECIAL") {
        // Delete Values
        delete newVal.status;
        delete newVal.type;
        delete newVal.referenceNumber;

        this.triggerRateLoading({
          title: "Update Special Room Rate",
          loading: true,
        }).then(() => {
          this.updateSpecialRoomRate({
            roomTypeReferenceNumber: this.referenceNumber,
            roomTypeRateReferenceNumber: payload.referenceNumber,
            payload: newVal,
          });
        });
      }
    },
    deleteRequestCategory: function () {
      this.triggerLoading(true).then(() => {
        this.deleteRoomCategory({
          roomTypeReferenceNumber: this.referenceNumber,
        });
      });
    },
    requestReservation: function (payload) {
      this.$router.push({
        name: "Booking",
        query: payload,
      });
    },
  },
  computed: {
    ...mapState("roomCategories", ["roomCategory", "meta"]),
    roomImages: function () {
      return this.roomCategory ? this.roomCategory.images : [];
    },
    hasData: function () {
      return !!this.roomCategory ?? false;
    },
  },
  created() {
    this.resetRoomCategory();
    this.fetchRoomCategoryMethod();
  },
};
</script>

<style scoped></style>
