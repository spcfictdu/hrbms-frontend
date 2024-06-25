<template>
  <div class="mt-10">
    <v-alert
      :value="alert"
      :type="status"
      class="w-full"
      transition="scroll-y-transition"
    >
      {{ alertProperties.message }}
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
      v-if="roomStatus && roomCategories"
    />
  </div>
</template>

<script>
import OccupiedRoomsComponent from "@/components/hotel-rooms/occupied/OccupiedRoomsComponent.vue";
import { mapState, mapActions } from "vuex";
import TablePagination from "@/mixins/TablePagination";

export default {
  name: "OccupiedRoomsView",
  components: { OccupiedRoomsComponent },
  mixins: [TablePagination],
  data: () => ({
    alert: false,
    status: null,
  }),
  computed: {
    ...mapState("occupied", {
      roomStatus: "roomStatus",
      alertProperties: "messageProperties",
      createRoomDialog: "createRoomDialog",
    }),
    ...mapState("roomCategories", {
      roomCategories: "roomCategories",
    }),
    ...mapState("rooms", {
      alertProperties: "alertProperties",
    }),
  },
  methods: {
    ...mapActions("occupied", [
      "fetchRoomStatus",
      "updateRoomStatus",
      "triggerOccupiedDialog",
    ]),
    ...mapActions("roomCategories", ["fetchRoomCategories"]),
    ...mapActions("rooms", ["createRoom", "deleteRoom", "editRoom"]),
    paginateRoomStatus: function (queryParams) {
      this.fetchRoomStatus(queryParams);
    },
    updateEvent: function ({ refNum, payload }) {
      this.updateRoomStatus({ roomRefNum: refNum, data: payload });
    },
    addRoomEvent: function (payload) {
      this.createRoom(payload);
    },
    deleteRoomEvent: function (referenceNumber) {
      this.deleteRoom(referenceNumber)
    },
    editRoomEvent: function ({referenceNumber, payload}) {
      this.editRoom({
        refNum: referenceNumber,
        data: payload
      })
    },
    triggerAlert: function (value) {
      this.alert = value;
    },
    triggerDialog: function () {
      this.triggerOccupiedDialog(false);
    },
  },
  created() {
    this.fetchRoomStatus();
    this.fetchRoomCategories();
  },
  watch: {
    alertProperties: {
      immediate: true,
      deep: true,
      handler: function (value) {
        if (value.type !== "") {
          this.status = value.type;
          this.triggerAlert(true);
          setTimeout(() => {
            this.triggerAlert(false);
            value.type = "";
            value.message = "";
            this.status = null;
          }, 3000);
        }
      },
    },
  },
};
</script>

<style scoped></style>
