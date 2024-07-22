<template>
  <div class="mt-10" v-if="roomCategory">
    <v-row>
      <v-col cols="12">
        <RoomImages :images="roomImages" />
      </v-col>
      <v-col cols="12">
        <RoomDetails
          :category="roomCategory"
          :metaLoading="meta"
          @reservation-event="requestReservation"
          @validation-event="assessRequestCall"
          @delete-event="deleteRequestCategory"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomImages from "@/components/layouts/images/RoomImages.vue";
import RoomDetails from "@/components/layouts/sections/RoomDetails.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "RoomDetailsView",
  components: { RoomImages, RoomDetails },
  data: () => ({
    referenceNumber: null,
  }),
  methods: {
    ...mapActions("roomCategories", [
      "fetchRoomCategory",
      "deleteRoomCategory",
      "triggerLoading",
    ]),
    ...mapActions("roomRates", [
      "createSpecialRoomRate",
      "deleteSpecialRoomRate",
      "updateRegularRoomRate",
      "updateSpecialRoomRate",
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

        this.createSpecialRoomRate({
          payload: newVal,
          roomTypeReferenceNumber: this.referenceNumber,
        });
      } else if (payload.status === "DELETE" && payload.type === "SPECIAL") {
        this.deleteSpecialRoomRate({
          roomTypeReferenceNumber: this.referenceNumber,
          roomTypeRateReferenceNumber: payload.referenceNumber,
        });
      } else if (payload.status === "UPDATE" && payload.type === "REGULAR") {
        // Delete Values
        delete newVal.status;
        delete newVal.type;
        delete newVal.referenceNumber;

        this.updateRegularRoomRate({
          roomTypeReferenceNumber: this.referenceNumber,
          roomTypeRateReferenceNumber: payload.referenceNumber,
          payload: newVal,
        });
      } else if (payload.status === "UPDATE" && payload.type === "SPECIAL") {
        // Delete Values
        delete newVal.status;
        delete newVal.type;
        delete newVal.referenceNumber;

        this.updateSpecialRoomRate({
          roomTypeReferenceNumber: this.referenceNumber,
          roomTypeRateReferenceNumber: payload.referenceNumber,
          payload: newVal,
        });
      }
    },
    deleteRequestCategory: function () {
      this.triggerLoading(true);
      this.deleteRoomCategory({
        roomTypeReferenceNumber: this.referenceNumber,
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
    ...mapState("roomCategories", {
      roomCategory: "roomCategory",
      meta: 'meta'
    }),
    roomImages: function () {
      return this.roomCategory ? this.roomCategory.images : [];
    },
  },
  created() {
    this.fetchRoomCategoryMethod();
  },
};
</script>

<style scoped></style>
