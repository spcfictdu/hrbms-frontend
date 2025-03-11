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
                  'warning--text': iter.text === 'Delete room',
                }"
                @click="iter.action()"
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
  </div>
</template>

<script>
export default {
  name: "RoomListCard",
  props: {
    room: Object,
    actions: Object,
  },
  data: () => ({}),
  methods: {
    chipColor: function (status) {
      const value = status.toLowerCase();
      const colors = {
        occupied: "occupied",
        reserved: "reserved",
        available: "available",
        unclean: "unclean",
        confirmed: "confirmed",
      };
      return value ? colors[value] : "primary";
    },
    menuItems: function (room) {
      // Status Payload & Meta for available, occupied, unclean, unallocated
      const statusPayload = (status) => ({
        requestType: "status",
        refNum: room.referenceNumber,
        data: {
          status,
        },
      });
      const statusMeta = (status) => ({
        action: "Change",
        actionType: "Room Status",
        message: `Change Room ${room.name} status to ${status.toLowerCase()}`,
      });

      const menu = [
        {
          text: "Make available",
          action: () => {
            this.actions.statusChange(
              statusPayload("AVAILABLE"),
              statusMeta("AVAILABLE")
            );
          },
        },
        {
          text: "Make occupied",
          action: () => {
            this.actions.statusChange(
              statusPayload("OCCUPIED"),
              statusMeta("OCCUPIED")
            );
          },
        },
        {
          text: "Make unclean",
          action: () => {
            this.actions.statusChange(
              statusPayload("UNCLEAN"),
              statusMeta("UNCLEAN")
            );
          },
        },
        {
          text: "Make unallocated",
          action: () => {
            this.actions.statusChange(
              statusPayload("UNALLOCATED"),
              statusMeta("UNALLOCATED")
            );
          },
        },
        {
          text: "Edit room details",
          action: () => {
            const payload = {
              refNum: room.referenceNumber,
              requestType: "edit",
            };
            const meta = {
              action: "Edit",
              value: {
                roomNumber: room.name,
                roomFloor: room.floor,
                roomType: room.type,
              },
            };
            this.actions.editRoom(payload, meta);
          },
        },
        {
          text: "Delete room",
          action: () => {
            const payload = {
              refNum: room.referenceNumber,
              requestType: "delete",
            };
            const meta = {
              message: room.name,
            };
            this.actions.deleteRoom(payload, meta);
          },
        },
      ];

      // Filter out the unavailable options per status
      const filters = {
        AVAILABLE: ["Make available", "Delete room"],
        OCCUPIED: ["Make occupied", "Delete room"],
        UNCLEAN: ["Make unclean", "Delete room"],
        UNALLOCATED: ["Make unallocated"],
      };

      return menu.filter(({ text }) => !filters[room.status].includes(text));
    },
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
