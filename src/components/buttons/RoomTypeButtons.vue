<template>
  <div>
    <v-row dense justify="space-between" class="pb-4 pb-sm-8">
      <v-col
        v-for="(i, index) in mappedRoomTypeEnum"
        :key="index"
        class="d-none d-sm-block"
      >
        <v-btn
          :ripple="false"
          depressed
          block
          height="40"
          :color="i.roomType === activeButton ? 'primary' : 'lightBg'"
          :loading="i.roomType === activeButton ? loadingButton : false"
          class="calendar-buttons text-subtitle-2"
          :class="
            i.roomType === activeButton
              ? 'font-weight-medium'
              : 'font-weight-regular'
          "
          @click="activeValue(i.roomType)"
          >{{ i.roomType }}</v-btn
        >
      </v-col>

      <!-- Mobile Breakpoint -->
      <v-col cols="12" class="d-block d-sm-none">
        <v-autocomplete
          rounded
          filled
          background-color="white"
          hide-details="auto"
          :items="mappedRoomTypeEnum"
          item-text="roomType"
          label="Select a Room"
          v-model="activeButton"
        ></v-autocomplete>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "RoomTypeButtons",
  props: { withAllRooms: Boolean, meta: Object },
  data: () => ({
    activeButton: "",
  }),
  created() {
    this.fetch();
  },
  methods: {
    ...mapActions("roomTypeEnum", ["fetchRoomTypes"]),
    fetch: async function () {
      await this.fetchRoomTypes();
    },
    capitalizeString(str) {
      const lowerCaseString = str.toLowerCase();
      return lowerCaseString
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
    activeValue(value) {
      this.activeButton = value;
    },
  },
  computed: {
    ...mapState("roomTypeEnum", ["roomTypeEnum"]),
    mappedRoomTypeEnum: function () {
      const roomTypes = this.roomTypeEnum
        ? this.roomTypeEnum.map((key) => ({
            roomType: this.capitalizeString(key.roomType),
            referenceNumber: key.referenceNumber,
          }))
        : [];

      if (this.withAllRooms) {
        roomTypes.unshift({
          roomType: "All Rooms",
          referenceNumber: null,
        });
      }

      return roomTypes;
    },
    loadingButton: function () {
      return this.meta?.title === "Calendar" ? this.meta.loading : false;
    },
  },
  watch: {
    activeButton: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.$emit("input-event", newVal);
        }
      },
    },
    roomTypeEnum: {
      deep: true,
      handler: function (newVal) {
        if (newVal) {
          this.activeButton = this.mappedRoomTypeEnum[0].roomType;
        }
      },
    },
  },
};
</script>

<style scoped>
.calendar-buttons {
  text-transform: capitalize;
}
.calendar-buttons:hover {
  background: #d3daff;
}
</style>
