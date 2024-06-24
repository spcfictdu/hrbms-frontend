<template>
  <div>
    <v-row>
      <v-col cols="3" v-for="(roomStatus, index) in buttonDisplay" :key="index">
        <v-btn
          height="75"
          block
          depressed
          :color="selectedStatus === roomStatus.title ? 'accentTwo' : 'lightBg'"
          @click="selectStatus(roomStatus.title)"
        >
          <v-row no-gutters>
            <v-col cols="12">
              <div
                class="text-h6"
                :class="
                  selectedStatus === roomStatus.title
                    ? 'font-weight-bold'
                    : 'font-weight-regular'
                "
              >
                {{ roomStatus.value }}
              </div>
            </v-col>
            <v-col cols="12">
              <div
                class="text-subtitle-2"
                :class="
                  selectedStatus === roomStatus.title
                    ? 'font-weight-bold'
                    : 'font-weight-regular'
                "
              >
                {{ roomStatus.title }}
              </div>
            </v-col>
          </v-row>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider class="my-5" />
    <v-row>
      <v-col cols="12">
        <v-card
          elevation="0"
          v-for="(category, index) in categoriesContent"
          :key="index"
          class="mb-5"
        >
          <v-card-title class="text-subtitle-1 font-weight-bold mb-3">
            {{ category.title }}
          </v-card-title>
          <v-card-text v-if="category.content.length > 0">
            <v-row
              v-for="(content, subIndex) in category.content"
              :key="subIndex"
              :class="subIndex < category.content.length - 1 ? 'mb-3' : ''"
              class="mx-3"
            >
              <v-col cols="2">ROOM {{ content.roomNumber }}</v-col>
              <v-col cols="2">Floor 7</v-col>
              <v-col>Guest: {{ content.guest }}</v-col>
              <v-col class="d-flex justify-end" cols="2"
                ><v-chip
                  :color="chipColor(content.status)"
                  dark
                  small
                  class="text-overline"
                  >{{ content.status }}</v-chip
                ></v-col
              >
              <v-col class="d-flex justify-end" cols="2"
                ><v-menu offset-x right rounded>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on"
                      ><v-icon>mdi-dots-vertical</v-icon></v-btn
                    >
                  </template>
                  <v-list dense class="pa-0">
                    <v-list-item
                      v-for="(option, optionsIndex) in statusOptions"
                      :key="optionsIndex"
                      :class="{
                        'menu-border': index < statusOptions.length - 1,
                      }"
                      @click="
                        changeRoomSatus(
                          option,
                          content.roomReferenceNumber,
                          content.roomNumber
                        )
                      "
                      ><v-list-item-title
                        class="text-subtitle-2 font-weight-regular"
                        >{{ option }}</v-list-item-title
                      ></v-list-item
                    >
                  </v-list>
                </v-menu></v-col
              >
            </v-row>
          </v-card-text>
          <v-card-text v-else>
            <v-row>
              <v-col cols="12" class="d-flex justify-center">
                There are no {{ selectedStatus.toLowerCase() }} rooms in this
                category.
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <RoomDialog
      :activator="dialogActivator"
      :dialogMeta="meta"
      :createRoom="createRoomDialog"
      :roomCategories="categoriesContent"
      @reset-activator="resetActivator"
      @update-request="updateRequest"
      @add-request="addRoomRequest"
    />
  </div>
</template>

<script>
import RoomDialog from "@/components/dialogs/RoomDialog.vue";

export default {
  name: "OccupiedRoomsComponent",
  components: { RoomDialog },
  props: {
    roomStatus: {
      type: Object,
      required: true,
    },
    roomCategories: {
      type: Object,
      required: true,
    },
    createRoomDialog: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    selectedStatus: "AVAILABLE",
    payload: {},
    dialogActivator: false,
    meta: {},
    selectedRefNum: null,
  }),
  computed: {
    buttonDisplay() {
      let buttonData = [];

      Object.keys(this.roomStatus).forEach((outerKey) => {
        if (outerKey.includes("roomStatusCount")) {
          const status = this.roomStatus[outerKey];
          Object.keys(status).forEach((innerKey) => {
            buttonData.push({
              title: innerKey,
              value: status[innerKey],
            });
          });
        }
      });
      return buttonData;
    },
    categoriesContent: function () {
      let categories = [];

      Object.keys(this.roomCategories).forEach((outerKey) => {
        if (outerKey.includes("roomTypes")) {
          const roomTypes = this.roomCategories[outerKey];
          Object.keys(roomTypes).forEach((indexKey) => {
            categories.push({
              title: roomTypes[indexKey]["name"],
              content: [],
            });
          });
        }
      });

      if (categories) {
        Object.keys(this.roomStatus).forEach((outerKey) => {
          if (outerKey === "rooms") {
            const rooms = this.roomStatus[outerKey];

            Object.keys(rooms).forEach((indexKey) => {
              categories.forEach((category) => {
                if (
                  rooms[indexKey]["roomType"] === category.title &&
                  this.selectedStatus === rooms[indexKey]["status"]
                ) {
                  category.content.push(rooms[indexKey]);
                }
              });
            });
          }
        });
      }
      return categories;
    },
    statusOptions: function () {
      let options = [];

      switch (this.selectedStatus) {
        case "AVAILABLE":
          return (options = ["Occupied", "Unclean", "Unallocated"]);
        case "OCCUPIED":
          return (options = ["Available", "Unclean", "Unallocated"]);
        case "UNCLEAN":
          return (options = ["Available", "Occupied", "Unallocated"]);
        case "UNALLOCATED":
          return (options = ["Available", "Occupied", "Unclean"]);
      }
    },
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },
  methods: {
    selectStatus: function (status) {
      this.selectedStatus = status;
    },
    chipColor: function (chipName) {
      switch (chipName) {
        case "AVAILABLE":
          return "available";
        case "OCCUPIED":
          return "occupied";
        case "UNCLEAN":
          return "unclean";
      }
    },
    changeRoomSatus: function (selectedOption, roomRefNum, roomNum) {
      switch (selectedOption) {
        case "Available":
          this.selectedRefNum = roomRefNum;
          this.dialogActivator = true;
          this.meta.room = roomNum;
          this.meta.status = "available";
          break;
        case "Occupied":
          this.selectedRefNum = roomRefNum;
          this.dialogActivator = true;
          this.meta.room = roomNum;
          this.meta.status = "occupied";
          break;
        case "Unclean":
          this.selectedRefNum = roomRefNum;
          this.dialogActivator = true;
          this.meta.room = roomNum;
          this.meta.status = "unclean";
          break;
        case "Unallocated":
          this.selectedRefNum = roomRefNum;
          this.dialogActivator = true;
          this.meta.room = roomNum;
          this.meta.status = "unallocated";
          break;
      }
    },
    resetActivator: function () {
      this.dialogActivator = false;
      this.payload = {};
      this.selectedRefNum = null;
      if (this.createRoomDialog) {
        this.$emit("close-dialog")
      }
    },
    updateRequest: function () {
      this.payload.status = this.meta.status.toUpperCase();
      this.$emit("update-event", {
        payload: this.payload,
        refNum: this.selectedRefNum,
      });
      this.dialogActivator = false;
      this.payload = {};
      this.selectedRefNum = null;
    },
    addRoomRequest: function (data) {
      this.$emit("add-room", data)
      this.dialogActivator = false;

    }
  },
  watch: {
    createRoomDialog: {
      immediate: true,
      handler: function (newVal) {
        this.dialogActivator = newVal;
      },
    },
    // size: {
    //   immediate: true,
    //   deep: true,
    //   handler: function (newVal) {
    //     switch (newVal) {
    //       case "md":
    //     }
    //   }
    // }
  },
};
</script>

<style scoped>
.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
