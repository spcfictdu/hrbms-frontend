<template>
  <div>
    <v-card flat class="card-border">
      <v-card-title class="text-subtitle-1">
        <div
            class="w-full d-flex flex-row justify-space-between align-center"
        >
          <div
              class="ml-3 d-none d-sm-flex text-body-1 text-uppercase font-weight-bold flex-grow-1"
          >
            ROOM {{ room.name }}
          </div>
          <div class="d-none d-sm-flex flex-grow-1">Floor {{ room.floor }}</div>
          <div class="d-none d-sm-flex text-caption text-sm-subtitle-1 flex-grow-1">
            Guest: {{ room.guest }}
          </div>

          <!-- Mobile Breakpoint -->
          <div class="ml-3 d-flex d-sm-none flex-column justify-center flex-grow-1">
            <div class="text-body-1 text-uppercase font-weight-bold">
              ROOM {{ room.name }}
            </div>
            <div class="text-caption">
              {{ room.guest }}
            </div>
          </div>

          <!-- Chip -->
          <div class="flex-shrink-1 flex-sm-shrink-0 flex-grow-0 flex-sm-grow-1 mr-2 mr-sm-0">
            <v-chip
                small
                class="text-uppercase font-weight-bold white--text"
                :color="chipColor(room.status)"
            >{{ room.status }}
            </v-chip>
          </div>


          <v-menu right offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn
              >
            </template>
            <v-list dense class="py-0">
              <v-list-item
                  :class="{
                    'menu-border': index < menuItems.length - 1,
                    'warning--text': iter.text === 'Remove room',
                  }"
                  v-for="(iter, index) in menuItems(room)"
                  :key="index"
              >
                <v-list-item-title class="text-body-2 font-weight-regular">{{
                    iter.text
                  }}
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
  },
  data: () => ({}),
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
    executeAction(option) {
      if (option.action) {
        option.action();
      } else if (option.route) {
        this.$router.push(option.route);
      }
    },
    menuItems: function (room) {
      // const confirmationRoute = ["RESERVED"];
      // const checkInCheckOutRoute = ["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"];

      let menu = [
        {
          text: "Edit room details",
          action: () => {
            
          },
        },
        {
          text: "Remove room",
          action: {},
        },
      ];

      if (room.status !== "AVAILABLE") {
        menu.splice(1, 0, {
          text: "View booking details",
          route: {},
        });
      }
      return menu;
    },
  },
  computed: {},
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
