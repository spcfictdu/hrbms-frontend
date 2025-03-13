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
          @validation-event="handleRequest($event)"
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
  props: {
    roomCategoryReferenceNumber: String,
  },
  data: () => ({}),
  methods: {
    ...mapActions("roomCategories", [
      "fetchRoomCategory",
      "deleteRoomCategory",
      "resetRoomCategory",
    ]),
    ...mapActions("roomCategories", {
      setCategoryLoading: "setLoading",
    }),
    ...mapActions("roomRates", [
      "createSpecialRoomRate",
      "deleteSpecialRoomRate",
      "updateRegularRoomRate",
      "updateSpecialRoomRate",
      "setLoading",
    ]),
    ...mapActions("dialogs", ["setDialogFn"]),
    ...mapActions("alerts", ["requireAlertFn"]),
    // API Calls
    fetch: async function () {
      await this.fetchRoomCategory(this.roomCategoryReferenceNumber);
    },
    handleRequest(payload) {
      // Prefetch alerts: success, error
      this.requireAlertFn(2);
      this.setLoading({ key: "dialog", value: true });

      const requests = {
        SPECIAL: {
          ADD: ({ data }) => this.createSpecialRoomRate(data),
          DELETE: ({ referenceNumber }) =>
            this.deleteSpecialRoomRate(referenceNumber),
          UPDATE: ({ data, referenceNumber }) =>
            this.updateSpecialRoomRate({
              roomTypeRateReferenceNumber: referenceNumber,
              payload: data,
            }),
        },
        REGULAR: {
          UPDATE: ({ data, referenceNumber }) =>
            this.updateRegularRoomRate({
              roomTypeRateReferenceNumber: referenceNumber,
              payload: data,
            }),
        },
      };

      const typeActions = requests[payload.type];
      const actionFn = typeActions?.[payload.action];

      if (actionFn) {
        actionFn({
          data: payload.data,
          referenceNumber: payload.referenceNumber,
        }).then(() => {
          this.fetch();
          this.setDialogFn({ key: "category_rate", value: false });
        });
      }
      this.setLoading({ key: "dialog", value: false });
    },
    deleteRequestCategory: function () {
      this.setCategoryLoading({ key: "delete", value: true });

      this.deleteRoomCategory(this.roomCategoryReferenceNumber)
        .then(() => {
          this.setDialogFn({ key: "category_delete", value: false });
          this.$router.push({ name: "Room Categories" });
        })
        .finally(() => {
          this.setCategoryLoading({ key: "delete", value: false });
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
    this.fetch();
  },
};
</script>

<style scoped></style>
