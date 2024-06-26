<template>
  <div>
    <v-row v-if="size.xs !== true">
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
    <v-row v-else>
      <v-col cols="12" class="d-block d-sm-none">
        <v-autocomplete
          rounded
          filled
          background-color="white"
          hide-details="auto"
          label="Select a Room Status"
          :items="buttonDisplay"
          item-text="title"
          item-value="title"
          v-model="selectedStatus"
        >
          <template v-slot:item="{ item }">
            <v-row>
              <v-col>{{ item.title }}</v-col>
            </v-row>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-divider class="my-5" />
    <v-row>
      <v-col class="text-h6 font-weight-bold ml-2" v-if="size.xs === true">
        {{ mobileHeader }}
      </v-col>
      <v-col cols="12" :class="{ 'pt-0': size.xs === true }">
        <v-card
          elevation="0"
          v-for="(category, index) in categoriesContent"
          :key="index"
          class="mb-5"
        >
          <v-card-title
            :class="[
              size.xs !== true
                ? 'text-subtitle-1 font-weight-bold mb-3'
                : 'text-subtitle-1 font-weight-bold pt-3',
            ]"
          >
            {{ category.title }}
          </v-card-title>
          <div v-if="category.content.length > 0">
            <v-row
              v-for="(content, subIndex) in category.content"
              :key="subIndex"
              :class="[
                subIndex < category.content.length - 1 ? 'mb-3' : '',
                size.xs !== true ? 'mx-5' : 'mx-2',
              ]"
            >
              <template v-if="size.xs !== true">
                <v-col
                  :cols="
                    selectedStatus === 'OCCUPIED' ||
                    selectedStatus === 'UNCLEAN'
                      ? 2
                      : 3
                  "
                  class="text-subtitle-2"
                  >ROOM {{ content.roomNumber }}</v-col
                >
                <v-col
                  :cols="
                    selectedStatus === 'OCCUPIED' ||
                    selectedStatus === 'UNCLEAN'
                      ? 2
                      : 3
                  "
                  class="text-subtitle-2"
                  >Floor {{ content.roomFloor }}</v-col
                >
                <v-col
                  cols="4"
                  v-if="
                    selectedStatus === 'OCCUPIED' ||
                    selectedStatus === 'UNCLEAN'
                  "
                  class="text-subtitle-2"
                  >Guest: {{ content.guest }}</v-col
                >
                <v-col
                  :class="
                    selectedStatus === 'OCCUPIED' ||
                    selectedStatus === 'UNCLEAN'
                      ? 'd-flex justify-center'
                      : 'd-flex justify-center'
                  "
                  cols="3"
                  ><v-chip
                    :color="chipColor(content.status)"
                    dark
                    small
                    class="text-overline"
                    >{{ content.status }}</v-chip
                  ></v-col
                >
                <v-col
                  class="d-flex justify-end"
                  :cols="selectedStatus === 'OCCUPIED' || selectedStatus === 'UNCLEAN' ? 1 : 3"
                  ><v-menu
                    :offset-x="offsetX"
                    :offset-y="offsetY"
                    right
                    rounded
                  >
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
                          'warning--text': option === 'Delete',
                        }"
                        @click="changeRoomSatus(option, content)"
                        ><v-list-item-title
                          class="text-subtitle-2 font-weight-regular"
                          >{{ option }}</v-list-item-title
                        ></v-list-item
                      >
                    </v-list>
                  </v-menu></v-col
                >
              </template>
              <template v-else>
                <v-col>
                  <v-col cols="12" class="text-subtitle-2"
                    >ROOM {{ content.roomNumber }}</v-col
                  >
                  <v-col cols="12" class="text-subtitle-2"
                    >Floor {{ content.roomFloor }}</v-col
                  >
                  <v-col
                    cols="12"
                    class="text-subtitle-2"
                    v-if="
                      selectedStatus === 'OCCUPIED' ||
                      selectedStatus === 'UNCLEAN'
                    "
                    >Guest: {{ content.guest }}</v-col
                  >
                  <v-col cols="12"
                    ><v-chip
                      :color="chipColor(content.status)"
                      dark
                      small
                      class="text-overline"
                      >{{ content.status }}</v-chip
                    ></v-col
                  >
                </v-col>
                <v-col class="d-flex justify-end" cols="1"
                  ><v-menu offset-y right rounded>
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
                          'warning--text': option === 'Delete',
                        }"
                        @click="changeRoomSatus(option, content)"
                        ><v-list-item-title
                          class="text-subtitle-2 font-weight-regular"
                          >{{ option }}</v-list-item-title
                        ></v-list-item
                      >
                    </v-list>
                  </v-menu></v-col
                >
              </template>
            </v-row>
          </div>
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
      :dialogFunction="dialogFunction"
      :roomCategories="categoriesContent"
      :roomDetails="roomDetails"
      @reset-activator="resetActivator"
      @update-request="updateRequest"
      @add-request="addRoomRequest"
      @edit-room-request="editRoomRequest"
    />
    <DeleteDialog
      :activator="deleteActivator"
      :deleteMeta="meta"
      @delete-event="deleteRoomRequest"
      @reset-activator="resetActivator"
    />
  </div>
</template>

<script>
import RoomDialog from "@/components/dialogs/RoomDialog.vue";
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue";

export default {
  name: "OccupiedRoomsComponent",
  components: { RoomDialog, DeleteDialog },
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
    dialogFunction: {
      createRoom: false,
      editRoom: false,
      changeRoomSatus: false,
    },
    deleteActivator: false,
    roomDetails: {
      roomNumber: null,
      roomFloor: null,
      roomType: "",
      status: "",
    },
    offsetX: true,
    offsetY: false,
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
          return (options = [
            "Occupied",
            "Unclean",
            "Unallocated",
            "Edit",
            "Delete",
          ]);
        case "OCCUPIED":
          return (options = ["Available", "Unclean", "Unallocated"]);
        case "UNCLEAN":
          return (options = [
            "Available",
            "Occupied",
            "Unallocated",
            "Edit",
            "Delete",
          ]);
        case "UNALLOCATED":
          return (options = [
            "Available",
            "Occupied",
            "Unclean",
            "Edit",
            "Delete",
          ]);
      }
    },
    size: function () {
      return this.$vuetify.breakpoint;
    },
    mobileHeader: function () {
      let numberRooms = null;

      this.buttonDisplay.forEach((category) => {
        if (category.title === this.selectedStatus) {
          numberRooms = category.value;
        }
      });

      let remainingLetters = this.selectedStatus
        .split("")
        .slice(1, this.selectedStatus.length)
        .join("")
        .toLowerCase();
      let firstLetter = this.selectedStatus.split("").slice(0, 1).join("");

      let status = firstLetter + remainingLetters;

      return numberRooms + " " + status + " Rooms";
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
    changeRoomSatus: function (selectedOption, roomDetails) {
      switch (selectedOption) {
        case "Available":
          this.dialogFunction.changeRoomSatus = true;
          this.selectedRefNum = roomDetails.roomReferenceNumber;
          this.dialogActivator = true;
          this.meta.room = roomDetails.roomNumber;
          this.meta.status = "available";
          break;
        case "Occupied":
          this.dialogFunction.changeRoomSatus = true;
          this.selectedRefNum = roomDetails.roomReferenceNumber;
          this.dialogActivator = true;
          this.meta.room = roomDetails.roomNumber;
          this.meta.status = "occupied";
          break;
        case "Unclean":
          this.dialogFunction.changeRoomSatus = true;
          this.selectedRefNum = roomDetails.roomReferenceNumber;
          this.dialogActivator = true;
          this.meta.room = roomDetails.roomNumber;
          this.meta.status = "unclean";
          break;
        case "Unallocated":
          this.dialogFunction.changeRoomSatus = true;
          this.selectedRefNum = roomDetails.roomReferenceNumber;
          this.dialogActivator = true;
          this.meta.room = roomDetails.roomNumber;
          this.meta.status = "unallocated";
          break;
        case "Delete":
          this.selectedRefNum = roomDetails.roomReferenceNumber;
          this.deleteActivator = true;
          this.meta.targetDeletion = "room";
          break;
        case "Edit":
          this.dialogFunction.editRoom = true;
          this.selectedRefNum = roomDetails.roomReferenceNumber;
          this.editRoom = true;
          this.dialogActivator = true;
          this.roomDetails.roomNumber = roomDetails.roomNumber;
          this.roomDetails.roomFloor = roomDetails.roomFloor;
          this.roomDetails.roomType = roomDetails.roomType;
          this.roomDetails.status = roomDetails.status;
          break;
      }
    },
    resetActivator: function () {
      if (this.createRoomDialog) {
        this.$emit("close-dialog");
      }

      if (this.dialogFunction.changeRoomSatus) {
        this.dialogFunction.changeRoomSatus = false;
      } else if (this.dialogFunction.createRoom) {
        this.dialogFunction.createRoom = false;
      } else {
        this.dialogFunction.editRoom = false;
      }

      this.dialogActivator = false;
      this.deleteActivator = false;
      this.payload = {};
      this.meta = {};
      this.selectedRefNum = null;
    },
    updateRequest: function () {
      this.payload.status = this.meta.status.toUpperCase();
      this.$emit("update-event", {
        payload: this.payload,
        refNum: this.selectedRefNum,
      });
      this.dialogActivator = false;
      this.payload = {};
      this.meta = {};
      this.selectedRefNum = null;
      this.dialogFunction.changeRoomSatus = false;
    },
    addRoomRequest: function (data) {
      this.$emit("add-room", data);
      this.dialogActivator = false;
      this.meta = {};
      this.dialogFunction.createRoom = false;
    },
    deleteRoomRequest: function () {
      this.$emit("delete-room", this.selectedRefNum);
      this.deleteActivator = false;
      this.meta = {};
    },
    editRoomRequest: function (data) {
      this.$emit("edit-room", {
        referenceNumber: this.selectedRefNum,
        payload: data,
      });
      this.dialogActivator = false;
      this.dialogFunction.editRoom = false;
      this.roomDetails.roomNumber = null;
      this.roomDetails.roomFloor = null;
      this.roomDetails.roomNumber = "";
      this.roomDetails.roomFloor = "";
    },
  },
  watch: {
    createRoomDialog: {
      immediate: true,
      handler: function (newVal) {
        this.dialogActivator = newVal;
        this.dialogFunction.createRoom = newVal;
      },
    },
    size: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (newVal.sm === true) {
          this.offsetX = false;
          this.offsetY = true;
        }
      },
    },
  },
};
</script>

<style scoped>
.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
