<template>
  <RouteLoader :target="hasData" class="mt-10">
    <OccupiedRoomsComponent
      :roomStatuses="roomStatuses"
      @request-event="requestEvent"
      @onQuery="assignQuery"
    />
  </RouteLoader>
</template>

<script>
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import OccupiedRoomsComponent from "@/components/hotel-rooms/occupied/OccupiedRoomsComponent.vue";
import { mapState, mapActions } from "vuex";
import { assignParams } from "@/mixins/FormattingFunctions";

export default {
  name: "OccupiedRoomsView",
  components: { OccupiedRoomsComponent, RouteLoader },
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
  created: function () {
    this.fetch(this.queryParams);
  },
  methods: {
    ...mapActions("occupied", [
      "fetchRoomStatus",
      "updateRoomStatus",
      "createRoom",
      "deleteRoom",
      "updateRoom",
      "setLoading",
    ]),
    ...mapActions("dialogs", ["setDialogFn"]),
    ...mapActions("alerts", ["requireAlertFn"]),
    fetch: async function (queryParams = {}) {
      await this.fetchRoomStatus(queryParams);
    },
    assignQuery: function (query_params) {
      this.assignParams(query_params);
    },
    requestEvent: function (payload) {
      const requests = {
        status: {
          loadingKey: "confirm",
          action: () =>
            this.updateRoomStatus({
              roomRefNum: payload.refNum,
              data: payload.data,
            }),
          dialogKey: "room_confirm",
        },
        delete: {
          loadingKey: "delete",
          action: () =>
            this.deleteRoom({
              refNum: payload.refNum,
            }),
          dialogKey: "room_delete",
        },
        edit: {
          loadingKey: "dialog",
          action: () =>
            this.updateRoom({
              refNum: payload.refNum,
              data: payload.data,
            }),
          dialogKey: "room_dialog",
        },
        add: {
          loadingKey: "dialog",
          action: () =>
            this.createRoom({
              data: payload.data,
            }),
          dialogKey: "room_dialog",
        },
      };

      const request = requests[payload.requestType];

      if (request) {
        // Prefetch alerts: success, error
        this.requireAlertFn(2);
        this.setLoading({ key: request.loadingKey, value: true });
        return request
          .action()
          .then(() => {
            this.setDialogFn({ key: request.dialogKey, value: false });
          })
          .finally(() => {
            this.setLoading({ key: request.loadingKey, value: false });
            this.fetch(this.queryParams);
          });
      }
    },
  },
  computed: {
    ...mapState("occupied", ["roomStatuses"]),
    hasData: function () {
      return !!this.roomStatuses ?? false;
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

<style scoped></style>
