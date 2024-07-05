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
      @close-dialog="triggerDialog"
      @update-event="updateEvent"
      @add-room="addRoomEvent"
      @edit-room="editRoomEvent"
      @delete-room="deleteRoomEvent"
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
    }),
    handleAlertType() {
      console.log(this.roomStatuses)
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
    updateEvent: function ({ refNum, payload }) {
      this.updateRoomStatus({ roomRefNum: refNum, data: payload });
      this.triggerEventFetch = true;
    },
    addRoomEvent: function (payload) {
      this.createRoom(payload);
      this.triggerEventFetch = true;
    },
    deleteRoomEvent: function (referenceNumber) {
      this.deleteRoom(referenceNumber);
      this.triggerEventFetch = true;
    },
    editRoomEvent: function ({ referenceNumber, payload }) {
      this.editRoom({
        refNum: referenceNumber,
        data: payload,
      });
      this.triggerEventFetch = true;
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
    roomStatus: {
      deep: true,
      handler: function () {
        if (this.triggerEventFetch === true) {
          this.fetchRoomStatus(this.queryParams);
          this.triggerEventFetch = false;
        }
      },
    },
    occupiedStatus: {
      immediate: true,
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
