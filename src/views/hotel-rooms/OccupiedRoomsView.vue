<template>
  <div class="mt-10">
    <v-alert
      :value="isShowAlert"
      :type="handleAlertType"
      class="w-full"
      transition="scroll-y-transition"
    >
      {{ occupiedStatus.message ?? occupiedStatus.message }}
    </v-alert>
    <OccupiedRoomsComponent
      :roomStatuses="roomStatuses"
      :occupiedDialog="occupiedDialog"
      :metaLoading="meta"
      @close-dialog="triggerDialog"
      @request-event="requestEvent"
      @query-pagination="paginateRoomStatus"
      @input-event="attachType"
    />
  </div>
</template>

<script>
import OccupiedRoomsComponent from "@/components/hotel-rooms/occupied/OccupiedRoomsComponent.vue";
import { mapState, mapActions } from "vuex";
import { assignParams } from "@/mixins/FormattingFunctions";

export default {
  name: "OccupiedRoomsView",
  components: { OccupiedRoomsComponent },
  mixins: [assignParams],
  data: () => ({
    isShowAlert: false,
    triggerEventFetch: false,
  }),
  computed: {
    ...mapState("occupied", {
      roomStatuses: "roomStatuses",
      occupiedStatus: "occupiedStatus",
      occupiedDialog: "occupiedDialog",
      meta: "meta",
    }),
    handleAlertType() {
      return this.occupiedStatus.status !== ""
        ? this.occupiedStatus.status.toLowerCase()
        : "success";
    },
  },
  methods: {
    ...mapActions("occupied", [
      "fetchRoomStatus",
      "updateRoomStatus",
      "triggerOccupiedDialog",
      "createRoom",
      "deleteRoom",
      "updateRoom",
      "triggerLoading",
    ]),
    paginateRoomStatus: function (query_params) {
      this.assignParams(query_params);
    },
    attachType: function ({ roomStatus, roomType }) {
      const object = {
        roomStatus: roomStatus,
        roomType: roomType,
      };
      this.assignParams(object);
    },
    requestEvent: function (payload) {
      switch (payload.requestType) {
        case "Change Room Status":
        this.triggerLoading(true);
          this.updateRoomStatus({
            roomRefNum: payload.refNum,
            data: payload.data,
            queryParams: this.queryParams,
          });
          this.triggerEventFetch = true;
          break;
        case "Delete room":
        this.triggerLoading(true);
          this.deleteRoom({
            refNum: payload.refNum,
            queryParams: this.queryParams,
          });
          this.triggerEventFetch = true;
          break;
        case "Edit room":
        this.triggerLoading(true);
          this.updateRoom({
            refNum: payload.refNum,
            data: payload.data,
            queryParams: this.queryParams,
          });
          this.triggerEventFetch = true;
          break;
        case "Add room":
          this.triggerLoading(true);
          this.createRoom({
            data: payload.data,
            queryParams: this.queryParams,
          });
          this.triggerEventFetch = true;
          break;
      }
    },
    triggerAlert: function (value) {
      this.isShowAlert = value;
    },
    triggerDialog: function () {
      this.triggerOccupiedDialog(false);
    },
  },
  watch: {
    queryParams: {
      deep: true,
      handler: function (newVal) {
        this.fetchRoomStatus(newVal);
      },
    },
    roomStatuses: {
      deep: true,
      handler: function () {
        if (this.triggerEventFetch === true) {
          this.fetchRoomStatus(this.queryParams);
          this.triggerEventFetch = false;
        }
      },
    },
    occupiedStatus: {
      deep: true,
      handler: function (newVal) {
        if (newVal.status !== "") {
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
