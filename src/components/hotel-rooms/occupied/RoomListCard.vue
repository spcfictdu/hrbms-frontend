<template>
  <div>
    <v-card flat class="card-border">
      <v-card-title class="text-subtitle-1">
        <div class="w-full d-flex flex-row justify-space-between align-center">
          <div
            class="ml-3 d-none d-sm-flex text-body-1 text-uppercase font-weight-bold flex-grow-1"
          >
            ROOM {{ room.name }}
          </div>
          <div class="d-none d-sm-flex flex-grow-1">Floor {{ room.floor }}</div>
          <div
            class="d-none d-sm-flex text-caption text-sm-subtitle-1 flex-grow-1"
          >
            Guest: {{ room.guest }}
          </div>

          <!-- Mobile Breakpoint -->
          <div
            class="ml-3 d-flex d-sm-none flex-column justify-center flex-grow-1"
          >
            <div class="text-body-1 text-uppercase font-weight-bold">
              ROOM {{ room.name }}
            </div>
            <div class="text-caption">
              {{ room.guest }}
            </div>
          </div>

          <!-- Chip -->
          <div
            class="flex-shrink-1 flex-sm-shrink-0 flex-grow-0 flex-sm-grow-1 mr-2 mr-sm-0"
          >
            <v-chip
              small
              class="text-uppercase font-weight-bold white--text"
              :color="chipColor(room.status)"
              >{{ room.status }}
            </v-chip>
          </div>

          <v-menu right offset-x left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense class="py-0">
              <v-list-item
                v-for="(iter, index) in menuItems(room)"
                :key="index"
                class="menu-border"
                :class="{
                  'warning--text': iter.text === 'Delete room'
                }"
                @click="executeMenuItem(iter)"
              >
                <v-list-item-title class="text-body-2 font-weight-regular"
                  >{{ iter.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-card-title>
    </v-card>
    <DeleteDialog
      :activator="metaDialog.deleteActivator"
      :deleteMeta="metaDialog"
      @reset-activator="resetActivator"
      @delete-event="requestType"
    />
    <RoomDialog
      :activator="metaDialog.roomActivator"
      :roomData="roomData"
      :metaDialog="metaDialog"
      :metaLoading="metaLoading"
      @reset-activator="resetActivator"
      @edit-event="requestType"
    />
    <ConfirmationDialog
      :activator="metaDialog.confirmActivator"
      :metaDialog="metaDialog"
      :metaLoading="metaLoading"
      @reset-activator="resetActivator"
      @change-event="requestType"
    />
  </div>
</template>

<script>
import RoomDialog from "@/components/dialogs/RoomDialog.vue";
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog.vue";

export default {
  name: "RoomListCard",
  components: { RoomDialog, DeleteDialog, ConfirmationDialog },
  props: {
    room: Object,
    metaLoading: Object,
  },
  data: () => ({
    metaDialog: {},
    payload: {},
    roomData: {},
    requestRefNum: "",
  }),
  methods: {
    chipColor: function (status) {
      const value = status.toLowerCase();
      let color = null;
      switch (value) {
        case "occupied":
          color = "occupied";
          break;
        case "reserved":
          color = "reserved";
          break;
        case "available":
          color = "available";
          break;
        case "unclean":
          color = "unclean";
          break;
        case "confirmed":
          color = "confirmed";
          break;
        default:
          color = "primary";
      }
      return color;
    },
    menuItems: function (room) {
      let menu = [
        {
          text: "Make available",
          action: () => {
            this.payload = {
              requestType: "Change Room Status",
              refNum: room.referenceNumber,
              data: {
                status: "AVAILABLE",
              },
            };
            this.metaDialog = {
              action: "Change Room Status",
              actionType: "Confirmation",
              message: `Change Room ${room.name} status to available`,
              confirmActivator: true,
            };
          },
        },
        {
          text: "Make occupied",
          action: () => {
            this.payload = {
              requestType: "Change Room Status",
              refNum: room.referenceNumber,
              data: {
                status: "OCCUPIED",
              },
            };
            this.metaDialog = {
              action: "Change Room Status",
              actionType: "Confirmation",
              message: `Change Room ${room.name} status to occupied`,
              confirmActivator: true,
            };
          },
        },
        {
          text: "Make unclean",
          action: () => {
            this.payload = {
              requestType: "Change Room Status",
              refNum: room.referenceNumber,
              data: {
                status: "UNCLEAN",
              },
            };
            this.metaDialog = {
              action: "Change Room Status",
              actionType: "Confirmation",
              message: `Change Room ${room.name} status to unclean`,
              confirmActivator: true,
            };
          },
        },
        {
          text: "Make unallocated",
          action: () => {
            this.payload = {
              requestType: "Change Room Status",
              refNum: room.referenceNumber,
              data: {
                status: "UNALLOCATED",
              },
            };
            this.metaDialog = {
              action: "Change Room Status",
              actionType: "Confirmation",
              message: `Change Room ${room.name} status to unallocated`,
              confirmActivator: true,
            };
          },
        },
        {
          text: "Edit room details",
          action: () => {
            this.payload = {
              refNum: room.referenceNumber,
              requestType: "Edit room",
            };
            this.roomData = {
              roomNumber: room.name,
              roomFloor: room.floor,
              roomType: room.type,
            };
            this.metaDialog = {
              action: "Edit room",
              actionType: "Edit room",
              roomActivator: true,
            };
          },
        },
        {
          text: "Delete room",
          action: () => {
            this.payload = {
              refNum: room.referenceNumber,
              requestType: "Delete room",
            };
            this.metaDialog = {
              action: "Delete room",
              targetDeletion: "room",
              deleteActivator: true,
            };
          },
        },
      ];

      switch (room.status) {
        case "AVAILABLE":
          menu = menu.filter(
            (item) =>
              item.text !== "Make available" && item.text !== "Delete room"
          );
          break;
        case "OCCUPIED":
          menu = menu.filter((item) =>
            ["Make available", "Make unclean", "Make unallocated"].includes(
              item.text
            )
          );
          break;
        case "UNCLEAN":
          menu = menu.filter(
            (item) =>
              item.text !== "Make unclean" && item.text !== "Delete room"
          );
          break;
        case "UNALLOCATED":
          menu = menu.filter((item) => item.text !== "Make unallocated");
          break;
      }
      return menu;
    },
    executeMenuItem: function (item) {
      if (item.text) {
        return item.action();
      }
    },
    requestType: function (requestData) {
      switch (this.metaDialog.action) {
        case "Change Room Status":
          this.$emit("request-type", this.payload);
          this.resetActivator();
          break;
        case "Delete room":
          this.$emit("request-type", this.payload);
          this.resetActivator();
          break;
        case "Edit room":
          this.payload.data = requestData;
          this.$emit("request-type", this.payload);
          this.resetActivator();
          break;
      }
    },
    resetActivator: function () {
      this.metaDialog = {};
    },
  },
  computed: {
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },
  watch: {
  },
};
</script>

<style scoped>
.w-full {
  width: 100%;
}

.card-border {
  border: 1px solid rgba(51, 51, 51, 0.1);
}

.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
