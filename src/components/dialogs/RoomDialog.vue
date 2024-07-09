<template>
  <v-dialog max-width="450" v-model="dialog" overlay-opacity="0.2">
    <v-form ref="roomForm">
      <v-card class="pa-8" rounded="lg" flat>
        <v-card-title
          class="transparent-bg text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-uppercase pa-0 mb-4"
          >{{ metaDialog.actionType }}</v-card-title
        >
        <div class="mt-4 mb-8">
          <div class="mb-2">
            <div class="text-caption ml-1 mb-1">Room Number</div>
            <v-text-field
              outlined
              dense
              hide-details="auto"
              v-model="payload.roomNumber"
              :rules="validate.roomNumber"
              type="number"
              hide-spin-buttons
            ></v-text-field>
          </div>
          <div class="mb-2">
            <div class="text-caption ml-1 mb-1">Room Floor</div>
            <v-text-field
              outlined
              dense
              hide-details="auto"
              v-model="payload.roomFloor"
              :rules="validate.roomFloor"
              type="number"
              hide-spin-buttons
            ></v-text-field>
          </div>
          <div>
            <div class="text-caption ml-1 mb-1">Room Type</div>
            <v-autocomplete
              outlined
              dense
              hide-details="auto"
              :items="roomTypeEnum"
              v-model="payload.roomType"
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
import { mapActions, mapState } from "vuex";

export default {
  name: "RoomDialog",
  props: {
    activator: Boolean,
    metaDialog: Object,
    roomData: Object,
  },
  data: () => ({
    dialog: false,
    payload: {
      roomNumber: "",
      roomFloor: "",
      roomType: "",
    },
  }),
  methods: {
    ...mapActions("roomTypeEnum", ["fetchRoomTypes"]),
    cancelButton: function () {
      this.$refs.roomForm.reset();
      this.$emit("reset-activator");
    },
    proceedButton: function () {
      if (this.metaDialog.actionType === "Edit room") {
        if (this.$refs.roomForm.validate()) {
          this.$emit("edit-event", this.payload);
          this.$refs.roomForm.reset();
        }
      } else {
        if (this.$refs.roomForm.validate()) {
          this.$emit("add-request", this.payload);
          this.$refs.roomForm.reset();
        }
      }
    },
    payloadContent: function () {
      return (this.payload = {
        roomNumber: this.roomData.roomNumber,
        roomFloor: this.roomData.roomFloor,
        roomType: this.roomData.roomType,
      });
    },
  },
  computed: {
    ...mapState("roomTypeEnum", ["roomTypeEnum"]),
    validate: function () {
      const errors = {};

      errors.roomNumber = [(v) => !!v || "Room number is required"];
      errors.roomFloor = [(v) => !!v || "Room floor is required"];
      errors.roomType = [(v) => !!v || "Room type is required"]; // Make it dynamic whenever adding and updating

      return errors;
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
    roomData: {
      handler: function () {
        if (this.roomData) {
          this.payloadContent();
        }
      },
    },
  },
};
</script>

<style scoped></style>
