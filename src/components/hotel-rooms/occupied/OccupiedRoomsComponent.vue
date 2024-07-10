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
            <v-row class="py-1">
              <v-col
                ><div>{{ item.status }}</div>
                <div class="text-subtitle-2">
                  {{ item.count }} {{ item.count > 1 ? "rooms" : "room" }}
                </div></v-col
              >
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
          <template v-slot:item="{ item }">
            <v-row>
              <v-col
                ><div>{{ item.roomType }}</div>
                <div class="text-subtitle-2">

                </div></v-col
              >
            </v-row>
          </template>
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

    <v-row class="mt-4" dense v-if="roomStatuses.rooms.length > 0">
      <v-col cols="12" v-for="(room, index) in mappedRoomStatuses" :key="index">
        <room-list-card
          :room="room"
          :queryParams="queryParams"
          @request-type="passRequest"
        />
      </v-col>
    </v-row>
    <v-row class="mt-7 pb-6" v-else>
      <v-col cols="12" class="d-flex justify-center">
        {{ emptyRoomMessage }}
      </v-col>
    </v-row>

    <v-pagination
      class="mt-4"
      v-model="page"
      :length="paginationLastPage"
    ></v-pagination>
    <RoomDialog
      :activator="metaDialog.createActivator"
      :metaDialog="metaDialog"
      @reset-activator="resetActivator"
      @add-request="addRoomRequest"
    />
  </div>
</template>

<script>
import RoomDialog from "@/components/dialogs/RoomDialog.vue";
import RoomListCard from "./RoomListCard.vue";
import { assignParams } from "@/mixins/FormattingFunctions";
import { mapActions, mapState } from "vuex";

export default {
  name: "OccupiedRoomsComponent",
  components: { RoomListCard, RoomDialog },
  mixins: [assignParams],
  props: {
    roomStatuses: Object,
    occupiedDialog: Boolean,
  },
  data: () => ({
    selectedStatus: "AVAILABLE",
    selectedRoomType: "JUNIOR STANDARD",
    emptyRoomMessage: "",
    page: 1,
    metaDialog: {},
    payload: {},
  }),
  computed: {
    ...mapState("roomTypeEnum", ["roomTypeEnum"]),
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
            type: item.roomType,
          }))
        : [];
    },
    paginationLastPage: function () {
      return this.roomStatuses ? this.roomStatuses.pagination.lastPage : 1;
    },
    autocompleteRoomType: function () {

    }
  },
  methods: {
    ...mapActions("roomTypeEnum", ["fetchRoomTypes"]),
    selectStatus: function (status) {
      this.selectedStatus = status;
    },
    passRequest: function (payload) {
      this.$emit("request-event", payload);
    },
    addRoomRequest: function (data) {
      this.payload = {
        requestType: "Add room",
        data: data,
      };
      this.passRequest(this.payload);
      this.resetActivator();
    },
    resetActivator: function () {
      this.metaDialog = {};
      this.$emit("close-dialog");
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
            " rooms in this category.";
        }, 3000);
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
        }, 3000);
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
    "roomStatuses.pagination": {
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
        this.metaDialog = {
          createActivator: newVal,
          actionType: "Add New Room",
        };
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
