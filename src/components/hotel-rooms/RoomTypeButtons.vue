<template>
  <div>
    <v-row dense justify="space-between" class="pb-4 pb-sm-8">
      <v-col
        v-for="(i, index) in mappedRoomTypeEnum"
        :key="index"
        class="d-none d-sm-block"
      >
        <v-btn
          depressed
          block
          height="40"
          :color="i.roomType === activeButton ? 'accentTwo' : 'lightBg'"
          class="calendar-buttons text-subtitle-2"
          :class="{
            'font-weight-bold': i.roomType === activeButton,
            'font-weight-regular': i.roomType !== activeButton,
          }"
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
  data: () => ({
    activeButton: "Junior Standard",
  }),
  props: {},
  methods: {
    ...mapActions("roomTypeEnum", ["fetchRoomTypes"]),
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
      return this.roomTypeEnum
        ? this.roomTypeEnum.map((key) => ({
            roomType: this.capitalizeString(key.roomType),
            referenceNumber: key.referenceNumber,
          }))
        : [];
    },
  },
  watch: {
    activeButton: {
      immediate: true,
      handler(newVal) {
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
  created() {
    this.fetchRoomTypes();
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
