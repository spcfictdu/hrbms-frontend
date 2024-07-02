<template>
  <div class="mt-10">
    <v-alert
      :value="alert"
      :type="type"
      class="w-full"
      transition="scroll-y-transition"
    >
      {{ alertMessage }}
    </v-alert>
    <OccupiedRoomsComponent
      :roomStatus="roomStatus"
      :roomCategories="roomCategories"
      :createRoomDialog="createRoomDialog"
      @close-dialog="triggerDialog"
      @update-event="updateEvent"
      @add-room="addRoomEvent"
      @edit-room="editRoomEvent"
      @delete-room="deleteRoomEvent"
      @query-pagination="paginateRoomStatus"
      @input-event="attachType"
      v-if="roomStatus && roomCategories"
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
    alert: false,
    type: null,
    alertMessage: "",
    triggerEventFetch: false,
  }),
  computed: {
    ...mapState("occupied", {
      roomStatus: "roomStatus",
      messageProperties: "alertProperties",
      createRoomDialog: "createRoomDialog",
    }),
    ...mapState("rooms", {
      alertProperties: "alertProperties",
    }),
    ...mapState("roomTypeEnum", {
      roomCategories: "roomTypeEnum",
    }),
  },
  methods: {
    ...mapActions("occupied", [
      "fetchRoomStatus",
      "updateRoomStatus",
      "triggerOccupiedDialog",
    ]),
    ...mapActions("rooms", ["createRoom", "deleteRoom", "editRoom"]),
    ...mapActions("roomTypeEnum", ["fetchRoomTypes"]),
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
      this.alert = value;
    },
    triggerDialog: function () {
      this.triggerOccupiedDialog(false);
    },
  },
  created() {
    this.fetchRoomTypes();
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
    alertProperties: {
      immediate: true,
      deep: true,
      handler: function (value) {
        if (value.type !== "") {
          this.type = value.type;
          this.alertMessage = value.message;
          this.triggerAlert(true);
          setTimeout(() => {
            this.triggerAlert(false);
            value.type = "";
            value.message = "";
            this.alertMessage = "";
            this.type = null;
          }, 3000);
        }
      },
    },
    messageProperties: {
      immediate: true,
      deep: true,
      handler: function (value) {
        if (value.type !== "") {
          this.type = value.type;
          this.alertMessage = value.message;
          this.triggerAlert(true);
          setTimeout(() => {
            this.triggerAlert(false);
            value.type = "";
            value.message = "";
            this.alertMessage = "";
            this.type = null;
          }, 3000);
        }
      },
    },
  },
};
</script>

<style scoped></style>
