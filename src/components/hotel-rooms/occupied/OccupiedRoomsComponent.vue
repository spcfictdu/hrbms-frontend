<template>
  <div>
    <v-row class="d-none d-sm-flex">
      <v-col v-for="(item, index) in buttonDisplay" :key="index">
        <v-btn
          height="75"
          x-large
          block
          depressed
          :color="selectedStatus === item.status ? 'primary' : 'lightBg'"
          @click="selectStatus(item.status)"
        >
          <div class="d-flex flex-column align-center justify-center">
            <div
              class="text-h6"
              :class="{
                'font-weight-regular': selectedStatus !== item.status,
                'font-weight-medium': selectedStatus === item.status,
              }"
            >
              {{ item.count }}
            </div>
            <div
              class="text-subtitle-2"
              :class="{
                'font-weight-regular': selectedStatus !== item.status,
                'font-weight-medium': selectedStatus === item.status,
              }"
            >
              {{ item.status }}
            </div>
          </div>
        </v-btn>
      </v-col>
    </v-row>
    <!-- Mobile Filter -->
    <v-row class="d-flex d-sm-none">
      <v-col cols="12">
        <v-autocomplete
          outlined
          dense
          hide-details="auto"
          label="Room Status"
          :items="buttonDisplay"
          item-text="status"
          item-value="status"
          v-model="selectedStatus"
        >
          <template v-slot:item="{ item }">
            <!-- Flex me ini -->
            <v-row>
              <v-col>{{ item.status }}</v-col>
            </v-row>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          hide-details="auto"
          dense
          outlined
          label="Room Category"
          :items="roomTypeEnum"
          item-text="roomType"
          item-value="roomType"
          v-model="selectedRoomType"
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-divider class="my-5" />
    <div style="max-width: 225px" class="d-none d-sm-flex">
      <v-autocomplete
        class="d-block"
        rounded
        filled
        hide-details="auto"
        dense
        background-color="lightBg"
        :items="roomTypeEnum"
        item-text="roomType"
        item-value="roomType"
        v-model="selectedRoomType"
      >
      </v-autocomplete>
    </div>

    <v-row class="mt-4" dense>
      <v-col cols="12" v-for="(room, index) in mappedRoomStatuses" :key="index">
        <room-list-card :room="room" />
      </v-col>

      <!-- Mobile Header -->
      <!-- <v-col class="text-h6 font-weight-bold ml-2" v-if="size.xs === true">
        {{ mobileHeader }}
      </v-col>
      <v-col cols="12" :class="{ 'pt-0': size.xs === true }">
        <v-card elevation="0" class="pb-6" :class="[size.xs !== true ? 'px-10' : 'px-5']">
          <div
            v-if="categoriesContent.content.length > 0"
            :class="[
              size.xs !== true
                ? 'text-subtitle-1 mt-10'
                : 'text-subtitle-1 pt-3',
            ]"
          >
            <v-row
              v-for="(content, index) in categoriesContent.content"
              :key="index"
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
                  :cols="
                    selectedStatus === 'OCCUPIED' ||
                    selectedStatus === 'UNCLEAN'
                      ? 1
                      : 3
                  "
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
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-divider
                    v-if="index < categoriesContent.content.length - 1" class="mt-n2"
                  />
                </v-col>
              </template> -->
      <!-- Rooms View in Mobile -->
      <!-- <template v-else>
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
                {{ emptyRoomMessage }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col> -->
    </v-row>
    <v-pagination
      class="mt-4"
      v-model="page"
      :length="paginationLastPage"
    ></v-pagination>
    <RoomDialog
      :activator="dialogActivator"
      :dialogMeta="meta"
      :dialogFunction="dialogFunction"
      :roomCategories="roomTypeEnum"
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
import RoomListCard from "./RoomListCard.vue";
import { assignParams } from "@/mixins/FormattingFunctions";
import { mapActions, mapState } from "vuex";

export default {
  name: "OccupiedRoomsComponent",
  components: { RoomDialog, DeleteDialog, RoomListCard },
  mixins: [assignParams],
  props: {
    roomStatuses: Object,
    occupiedDialog: Boolean,
  },
  data: () => ({
    selectedStatus: "AVAILABLE",
    selectedRoomType: "JUNIOR STANDARD",
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
    page: 1,
    emptyRoomMessage: "",
  }),
  computed: {
    ...mapState("roomTypeEnum", {
      roomTypeEnum: "roomTypeEnum",
    }),
    buttonDisplay() {
      let buttonData = [];
      const countData = this.roomStatuses?.roomStatusCount;

      countData &&
        Object.keys(countData).forEach((key) => {
          buttonData.push({
            count: countData[key],
            status: key,
          });
        });

      return buttonData;
    },

    mappedRoomStatuses: function () {
      return this.roomStatuses
        ? this.roomStatuses.rooms.map((item) => ({
            name: item.roomNumber,
            floor: item.roomFloor,
            guest: item.guest ? item.guest : "No Occupant",
            status: item.status,
            referenceNumber: item.roomReferenceNumber,
          }))
        : [];
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
    paginationLastPage: function () {
      return this.roomStatus ? this.roomStatus.pagination.lastPage : 1;
    },
  },
  methods: {
    ...mapActions("roomTypeEnum", ["fetchRoomTypes"]),
    selectStatus: function (status) {
      this.selectedStatus = status;
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
    selectedStatus: {
      immediate: true,
      handler: function (status) {
        this.$emit("input-event", {
          roomStatus: status,
          roomType: this.selectedRoomType,
        });

        this.emptyRoomMessage = "Loading...";
        setTimeout(() => {
          this.emptyRoomMessage =
            "There are no " +
            this.selectedStatus.toLowerCase() +
            " rooms in this category";
        }, 5000);
      },
    },
    selectedRoomType: {
      immediate: true,
      handler: function (type) {
        this.$emit("input-event", {
          roomStatus: this.selectedStatus,
          roomType: type,
        });

        this.emptyRoomMessage = "Loading...";
        setTimeout(() => {
          this.emptyRoomMessage =
            "There are no " +
            this.selectedStatus.toLowerCase() +
            " rooms in this category.";
        }, 5000);
      },
    },
    page: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        const object = {
          perPage: 5,
          page: newVal,
        };
        this.assignParams(object);
      },
    },
    "roomStatus.pagination": {
      deep: true,
      handler: function (newVal) {
        this.page = newVal.currentPage;
      },
    },
    queryParams: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        this.$emit("query-pagination", newVal);
      },
    },
    occupiedDialog: {
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
  created() {
    this.fetchRoomTypes();
  },
};
</script>

<style scoped>
.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
