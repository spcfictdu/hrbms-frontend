<template>
  <div>
    <v-row>
      <!-- Alert -->
      <v-col cols="12" v-if="isShowAlert">
        <v-alert
          :value="isShowAlert"
          :type="handleAlertType"
          class="w-full"
          transition="scroll-y-transition"
        >
          {{ ratesStatus.message ?? ratesStatus.message }}
        </v-alert>
      </v-col>
      <!-- Information -->
      <v-col cols="12" md="8">
        <room-info
          v-if="category"
          :room="room"
          @validation-event="(e) => $emit('validation-event', e)"
          @delete-event="$emit('delete-event')"
        />
      </v-col>
      <v-col cols="12" md="4">
        <room-reservation-form :roomCategory="room.name"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomInfo from "@/components/hotel-rooms/categories/RoomInfo.vue";
import RoomReservationForm from "@/components/hotel-rooms/categories/RoomReservationForm.vue";
import { mapState } from "vuex";
export default {
  name: "RoomDetails",
  components: { RoomInfo, RoomReservationForm },
  props: {
    category: Object,
  },
  data: () => ({
    isShowAlert: false,
  }),
  methods: {
    triggerAlert: function (value) {
      this.isShowAlert = value;
    },
  },
  computed: {
    ...mapState("roomRates", {
      ratesStatus: "ratesStatus",
    }),
    handleAlertType() {
      return this.ratesStatus.status !== ""
        ? this.ratesStatus.status.toLowerCase()
        : "success";
    },
    room: function () {
      const category = this.category;
      let room = {
        referenceNumber: category.referenceNumber,
        name: category.name,
        price: category.price,
        maxOccupancy: category.capacity,
        description: category.description,
        amenities: category.amenities,
        prices: [
          {
            rate: "Regular Rate",
            sunday: category.rates.regular.sunday,
            monday: category.rates.regular.monday,
            tuesday: category.rates.regular.tuesday,
            wednesday: category.rates.regular.wednesday,
            thursday: category.rates.regular.thursday,
            friday: category.rates.regular.friday,
            saturday: category.rates.regular.saturday,
            referenceNumber: category.rates.regular.referenceNumber,
          },
        ],
        rooms: category.rooms.map((key) => ({
          name: key.roomNumber,
          floor: "Floor 1",
          guest: key.guest ? key.guest : "None",
          status: key.status,
        })),
      };

      category.rates.special.forEach((key) => {
        room.prices.push({
          rate: key.discountName,
          startDate: key.startDate,
          endDate: key.endDate,
          referenceNumber: key.referenceNumber,
          sunday: key.sunday,
          monday: key.monday,
          tuesday: key.tuesday,
          wednesday: key.wednesday,
          thursday: key.thursday,
          friday: key.friday,
          saturday: key.saturday,
          referenceNumber: key.referenceNumber,
        });
      });

      return room;
    },
  },
  watch: {
    ratesStatus: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (
          newVal.status.toLowerCase() === "success" ||
          newVal.status.toLowerCase() === "error"
        ) {
          this.triggerAlert(true);
          let interval = setInterval(() => {
            this.triggerAlert(false);
            clearInterval(interval);
          }, 3000);
        }
      },
    },
  },
};
</script>

<style scoped></style>
