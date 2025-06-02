<template>
  <div v-if="roomStatuses">
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
              :class="
                selectedStatus === item.status
                  ? 'font-weight-medium'
                  : 'font-weight-regular'
              "
            >
              {{ item.count }}
            </div>
            <div
              class="text-subtitle-2"
              :class="
                selectedStatus === item.status
                  ? 'font-weight-medium'
                  : 'font-weight-regular'
              "
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
                <div class="text-subtitle-2"></div
              ></v-col>
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

    <!-- Room Lists -->
    <v-row class="mt-4" dense v-if="roomStatuses.rooms.length > 0">
      <v-col cols="12" v-for="(room, index) in mappedRoomStatuses" :key="index">
        <RoomListCard
          :room="room"
          :actions="{
            statusChange: (payload, meta) => assessPayload(payload, meta),
            deleteRoom: (payload, meta) => {
              assessPayload(payload, meta);
            },
            editRoom: (payload, meta) => {
              assessPayload(payload, meta);
            },
          }"
        />
      </v-col>
    </v-row>
    <v-col v-else>
      <NoDataFoundCard :meta="noDataCardMeta" />
    </v-col>

    <!-- Pagination -->
    <v-pagination
      class="mt-4"
      v-model="queryParams.page"
      :length="paginationLength"
    ></v-pagination>

    <!-- Dialogs -->
    <RoomDialog
      :opened="room_dialog"
      :onClose="() => setDialogFn({ key: 'room_dialog', value: false })"
      :meta="meta"
      :loading="loading.dialog"
      @onSubmit="handleRequest"
    />
    <ConfirmationDialog
      :opened="room_confirm"
      :onClose="() => setDialogFn({ key: 'room_confirm', value: false })"
      :meta="meta_confirm"
      :loading="loading.confirm"
      @onProceed="handleRequest"
    />
    <DeleteDialog
      :opened="room_delete"
      :onClose="() => setDialogFn({ key: 'room_delete', value: false })"
      :message="meta_delete.message"
      :loading="loading.delete"
      @onDelete="handleRequest"
    />
  </div>
</template>

<script>
import NoDataFoundCard from "@/components/cards/NoDataFoundCard.vue";
import RoomDialog from "@/components/dialogs/RoomDialog.vue";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog.vue";
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue";
import RoomListCard from "./RoomListCard.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "OccupiedRoomsComponent",
  components: {
    RoomListCard,
    RoomDialog,
    NoDataFoundCard,
    ConfirmationDialog,
    DeleteDialog,
  },
  props: {
    roomStatuses: Object,
  },
  data: () => ({
    selectedStatus: "AVAILABLE",
    selectedRoomType: "JUNIOR STANDARD",
    payload: {
      requestType: null,
    },

    // Dialog Meta
    meta: {
      action: "",
      value: null,
    },
    meta_confirm: {
      action: "",
      actionType: "",
      message: "",
    },
    meta_delete: {
      message: "",
    },

    // Initial Params
    queryParams: {
      roomStatus: "AVAILABLE",
      roomType: "JUNIOR STANDARD",
      per_page: 5,
      page: 1,
    },
  }),
  created() {
    this.fetchRoomTypes();
  },
  methods: {
    ...mapActions("roomTypeEnum", ["fetchRoomTypes"]),
    ...mapActions("dialogs", ["setDialogFn"]),
    selectStatus: function (status) {
      this.selectedStatus = status;
    },
    handleRequest: function (v) {
      // API Request Function
      // IF requestType is add/edit, assign a data key to payload.
      if (["add", "edit"].includes(this.payload.requestType)) {
        this.payload.data = v;
      }
      this.$emit("request-event", this.payload);
    },
    assessPayload: function (payload, meta) {
      // Assess Function for Status Changes.
      this.payload = payload;

      const requests = {
        status: {
          metaKey: "meta_confirm",
          dialogKey: "room_confirm",
        },
        delete: {
          metaKey: "meta_delete",
          dialogKey: "room_delete",
        },
        edit: {
          metaKey: "meta",
          dialogKey: "room_dialog",
        },
      };

      // If action has value, open the necessary dialogs.
      const action = requests[payload.requestType];

      if (action) {
        this[action.metaKey] = meta;
        this.setDialogFn({ key: action.dialogKey, value: true });
      }
    },
    resetPayload: function () {
      this.payload = {
        requestType: "",
      };
      this.meta = {
        action: "",
        value: null,
      };
    },
  },
  computed: {
    ...mapState("roomTypeEnum", ["roomTypeEnum"]),
    ...mapState("occupied", ["loading", "roomSearchQuery"]),
    ...mapState("dialogs", ["room_dialog", "room_confirm", "room_delete"]),
    buttonDisplay() {
      const countData = this.roomStatuses.roomStatusCount;
      return Object.keys(countData).map((key) => ({
        count: countData[key],
        status: key,
      }));
    },
    mappedRoomStatuses: function () {
      if (!this.roomStatuses) return [];

      const roomStatuses = this.roomStatuses.rooms.map((item) => ({
        name: item.roomNumber,
        floor: item.roomFloor,
        guest: item.guest ? item.guest : "No Occupant",
        status: item.status,
        referenceNumber: item.roomReferenceNumber,
        type: item.roomType,
      }));

      if (this.roomSearchQuery) {
        return roomStatuses.filter((room) =>
          room.name.toString().includes(this.roomSearchQuery)
        );
      }

      return roomStatuses;
    },
    paginationLength: function () {
      return this.roomStatuses ? this.roomStatuses.pagination.lastPage : 1;
    },
    noDataCardMeta: function () {
      return {
        title: "rooms",
        loading: this.loading.fetch,
      };
    },
  },
  watch: {
    room_dialog: {
      deep: true,
      handler: function (v) {
        if (v) {
          // Default to add, if meta has no value
          if (this.meta.action === "") {
            this.payload.requestType = "add";
            this.meta = {
              action: "Add",
              value: null,
            };
          }
        } else {
          this.resetPayload();
        }
      },
    },
    selectedStatus: {
      immediate: true,
      handler: function (status) {
        this.queryParams.roomStatus = status;
      },
    },
    selectedRoomType: {
      immediate: true,
      handler: function (type) {
        this.queryParams.roomType = type;
      },
    },
    queryParams: {
      deep: true,
      handler: function (newVal) {
        this.$emit("onQuery", newVal);
      },
    },
  },
};
</script>

<style scoped></style>
