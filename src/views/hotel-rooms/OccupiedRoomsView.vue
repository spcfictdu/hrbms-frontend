<template>
  <OccupiedRoomsComponent
    :loading="loading"
    :class="`${this.$vuetify.breakpoint.xs ? 'mt-2' : 'mt-5'}`"
    :roomStatuses="roomStatuses"
    @request-event="requestEvent"
    @onQuery="assignQuery"
  />
</template>

<script>
import OccupiedRoomsComponent from "@/components/hotel-rooms/occupied/OccupiedRoomsComponent.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import { assignParams } from "@/mixins/FormattingFunctions";

export default {
  name: "OccupiedRoomsView",
  components: { OccupiedRoomsComponent },
  mixins: [assignParams],
  data: () => ({
    // Default Params
    queryParams: {
      roomStatus: "AVAILABLE",
      roomType: "JUNIOR STANDARD",
      per_page: 5,
      page: 1,
    },
  }),
  created() {
    this.fetch(this.queryParams);
  },
  methods: {
    ...mapActions("occupied", [
      "fetchRoomStatus",
      "updateRoomStatus",
      "createRoom",
      "deleteRoom",
      "updateRoom",
    ]),
    ...mapActions("dialogs", ["setDialogFn"]),
    fetch(queryParams = {}) {
      this.fetchRoomStatus(queryParams);
    },
    assignQuery(query_params) {
      this.assignParams(query_params);
    },
    async requestEvent(payload) {
      const requests = {
        status: {
          action: () =>
            this.updateRoomStatus({
              roomRefNum: payload.refNum,
              data: payload.data,
            }),
          dialogKey: "room_confirm",
        },
        delete: {
          action: () =>
            this.deleteRoom({
              refNum: payload.refNum,
            }),
          dialogKey: "room_delete",
        },
        edit: {
          action: () =>
            this.updateRoom({
              refNum: payload.refNum,
              data: payload.data,
            }),
          dialogKey: "room_dialog",
        },
        add: {
          action: () =>
            this.createRoom({
              data: payload.data,
            }),
          dialogKey: "room_dialog",
        },
      };

      const request = requests[payload.requestType];

      if (!request) return;

      await request.action();
      this.setDialogFn({ key: request.dialogKey, value: false });
      this.fetch(this.queryParams);
    },
  },
  computed: {
    ...mapState("occupied", ["roomStatuses"]),
    ...mapGetters("occupied", ["getLoading"]),

    loading() {
      return this.getLoading("roomStatuses");
    },
  },
  watch: {
    queryParams: {
      deep: true,
      handler: function (v) {
        this.fetch(v);
      },
    },
  },
};
</script>
