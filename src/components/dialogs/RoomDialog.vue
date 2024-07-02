<template>
  <v-dialog max-width="450" v-model="dialog" overlay-opacity="0.2">
    <v-form ref="roomForm">
      <v-card
        class="pa-8"
        rounded="lg"
        flat
        v-if="dialogFunction.changeRoomSatus"
      >
        <v-card-title
          class="transparent-bg text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-uppercase pa-0"
          >Change Room Status Confirmation</v-card-title
        >
        <p class="py-2 py-sm-4 text-caption text-sm-body-2 font-weight-regular">
          Change Room {{ dialogMeta.room }} status to {{ dialogMeta.status }}?
        </p>
        <v-card-actions class="pa-0 mt-4">
          <v-row dense>
            <v-col cols="12" sm="6" order="last" order-sm="first"
              ><v-btn text block color="warning" @click="cancelButton"
                >Cancel</v-btn
              ></v-col
            >
            <v-col cols="12" sm="6"
              ><v-btn
                text
                block
                color="primary"
                class="lightBg"
                @click="proceedButton"
                >Proceed</v-btn
              ></v-col
            >
          </v-row>
        </v-card-actions>
      </v-card>
      <v-card
        class="pa-8"
        rounded="lg"
        flat
        v-else-if="dialogFunction.createRoom || dialogFunction.editRoom"
      >
        <v-card-title
          class="transparent-bg text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-uppercase pa-0 mb-4"
          >{{
            dialogFunction.createRoom ? "Add New Room" : "Edit Room"
          }}</v-card-title
        >
        <div class="mt-4 mb-8">
          <div class="mb-2">
            <div class="text-caption ml-1 mb-1">Room Number</div>
            <v-text-field
              outlined
              dense
              hide-details="auto"
              v-model="roomDetails.roomNumber"
              :rules="validate.roomNumber"
              type="number"
            ></v-text-field>
          </div>
          <div class="mb-2">
            <div class="text-caption ml-1 mb-1">Room Floor</div>
            <v-text-field
              outlined
              dense
              hide-details="auto"
              v-model="roomDetails.roomFloor"
              :rules="validate.roomFloor"
              type="number"
            ></v-text-field>
          </div>
          <div>
            <div class="text-caption ml-1 mb-1">Room Type</div>
            <v-autocomplete
              outlined
              dense
              hide-details="auto"
              :items="roomCategories"
              v-model="roomDetails.roomType"
              :rules="validate.roomType"
              item-text="roomType"
              item-value="roomType"
            ></v-autocomplete>
          </div>
        </div>
        <v-card-actions class="pa-0 mt-4">
          <v-row dense>
            <v-col cols="12" sm="6" order="last" order-sm="first"
              ><v-btn text block color="warning" @click="cancelButton"
                >Cancel</v-btn
              ></v-col
            >
            <v-col cols="12" sm="6"
              ><v-btn
                text
                block
                color="primary"
                class="lightBg"
                @click="proceedButton"
                >Proceed</v-btn
              ></v-col
            >
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { roomCategories } from '@/store/categories/room-categories';

export default {
  name: "RoomDialog",
  props: {
    activator: {
      type: Boolean,
      required: true,
    },
    dialogMeta: {
      type: Object,
      required: true,
    },
    dialogFunction: {
      type: Object,
      required: true,
    },
    roomCategories: {
      type: Array,
      required: true,
    },
    roomDetails: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    categories: function () {
      let categories = [];

      this.roomCategories.forEach((room) => {
        categories.push(room.title);
      });
      return categories;
    },
    validate: function () {
      const errors = {};

      errors.roomNumber = [(v) => !!v || "Room number is required"];
      errors.roomFloor = [(v) => !!v || "Room floor is required"];
      errors.roomType = [(v) => !!v || "Room type is required"];

      return errors;
    },
  },
  methods: {
    cancelButton: function () {
      this.$emit("reset-activator");
      this.$refs.roomForm.reset();
    },
    proceedButton: function () {
      if (this.dialogFunction.changeRoomSatus) {
        this.$emit("update-request");
      } else if (this.dialogFunction.createRoom) {
        if (this.$refs.roomForm.validate()) {
          this.$emit("add-request", this.roomDetails);
          this.$refs.roomForm.reset();
        }
      } else {
        if (this.$refs.roomForm.validate()) {
          this.$emit("edit-room-request", this.roomDetails);
          this.$refs.roomForm.reset();
        }
      }
    },
  },
  watch: {
    activator: {
      handler: function (newVal) {
        this.dialog = newVal;
      },
    },
    dialog: {
      handler: function (newVal) {
        if (!newVal) {
          this.$emit("reset-activator");
        }
      },
    },
  },
};
</script>

<style scoped></style>
