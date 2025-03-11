<template>
  <DialogTemplate
    maxWidth="450"
    :opened="opened"
    :onClose="onClose"
    :action="meta.action"
    title="Room"
    @onSubmit="handleProceed"
  >
    <FormField label="Room Number" class="mb-4">
      <v-text-field
        outlined
        dense
        hide-details="auto"
        v-model="payload.roomNumber"
        :rules="rules.roomNumber"
        type="number"
        hide-spin-buttons
      ></v-text-field>
    </FormField>
    <FormField label="Room Floor" class="mb-4">
      <v-text-field
        outlined
        dense
        hide-details="auto"
        v-model="payload.roomFloor"
        :rules="rules.roomFloor"
        type="number"
        hide-spin-buttons
      ></v-text-field>
    </FormField>
    <FormField label="Room Type" class="mb-4">
      <v-autocomplete
        outlined
        dense
        hide-details="auto"
        :items="roomTypeEnum"
        v-model="payload.roomType"
        :rules="rules.roomType"
        item-text="roomType"
        item-value="roomType"
      ></v-autocomplete>
    </FormField>
    <v-card-actions class="pa-0">
      <v-row dense>
        <v-col cols="12" sm="6" order="last" order-sm="first"
          ><v-btn text block color="warning" @click="handleCancel"
            >Cancel</v-btn
          ></v-col
        >
        <v-col cols="12" sm="6"
          ><v-btn
            text
            block
            color="primary"
            class="lightBg"
            :loading="loading"
            type="submit"
            >Proceed</v-btn
          ></v-col
        >
      </v-row>
    </v-card-actions>
  </DialogTemplate>
</template>

<script>
import { mapActions, mapState } from "vuex";
import DialogTemplate from "./DialogTemplate.vue";
import FormField from "../fields/FormField.vue";
export default {
  name: "RoomDialog",
  components: { DialogTemplate, FormField },
  props: {
    opened: Boolean,
    onClose: Function,
    meta: Object,
    loading: Boolean,
  },
  data: () => ({
    payload: {
      roomNumber: null,
      roomFloor: null,
      roomType: null,
    },
  }),
  created: function () {
    this.fetchRoomTypes();
  },
  methods: {
    ...mapActions("roomTypeEnum", ["fetchRoomTypes"]),
    handleCancel: function () {
      this.onClose();
    },
    handleProceed: function () {
      this.$emit("onSubmit", this.payload);
    },
    assignPayload: function (v) {
      this.payload = {
        roomNumber: v.roomNumber,
        roomFloor: v.roomFloor,
        roomType: v.roomType,
      };
    },
  },
  computed: {
    ...mapState("roomTypeEnum", ["roomTypeEnum"]),
    rules: function () {
      const errors = {};
      errors.roomNumber = [(v) => !!v || "Room number is required"];
      errors.roomFloor = [(v) => !!v || "Room floor is required"];
      errors.roomType = [(v) => !!v || "Room type is required"];
      return errors;
    },
  },
  watch: {
    meta: {
      handler: function (v) {
        if (v.value) {
          this.assignPayload(v.value);
        } else {
          this.payload = {
            roomNumber: null,
            roomFloor: null,
            roomType: null,
          };
        }
      },
    },
  },
};
</script>

<style scoped></style>
