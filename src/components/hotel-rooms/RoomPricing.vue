<template>
  <v-container class="mt-n10">
    <v-card
      elevation="0 pa-4 my-5"
      v-for="(room, index) in roomTypes"
      :key="index"
    >
      <div
        class="d-flex flex-md-row flex-column justify-md-space-between align-md-center"
      >
        <p class="text-subtitle-2 font-weight-bold">{{ room.room }}</p>
        <div class="d-flex align-center">
          <p class="text-caption font-weight-regular" v-if="room.discount">
            <span class="mr-md-2">
              <v-chip
                small
                color="primary"
                class="text-subtitle-2 white--text"
                >{{ room.discount }}</v-chip
              >
            </span>
            {{ room.discountDate }}
          </p>

          <v-menu offset-y left rounded>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" class="mt-n5"
                ><v-icon>mdi-dots-vertical</v-icon></v-btn
              >
            </template>
            <v-list dense>
              <v-list-item v-for="(option, index) in menuList" :key="index">
                <v-list-item-content>
                  <v-list-item-title :class="listTitleColor(option.option)">{{ option.option }}</v-list-item-title>
                  <v-divider class="mt-3" v-if="index < menuList.length - 1"/>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <v-data-table
        elevation="0"
        dense
        hide-default-footer
        class="price-table"
        :headers="headers"
        :items="tableContent(room.room)"
        :items-per-page="5"
      ></v-data-table>
    </v-card>
    <EditRegularRate :activator="regularRateDialog"/>
  </v-container>
</template>
<script>
import RoomsList from "../../components/hotel-rooms/RoomsList.vue";
import HotelRoomsHeader from "../../components/headers/HotelRoomsHeader.vue";
import EditRegularRate from '../dialogs/EditRegularRate.vue';
export default {
  name: "RoomPricing",
  components: { RoomsList, HotelRoomsHeader, EditRegularRate },
  data: () => ({
    regularRateDialog: false,
    specialRateDialog: false,
    headers: [
      {
        text: "Rates (in peso)",
        value: "rate",
      },
      {
        text: "Sun",
        value: "sunday",
      },
      {
        text: "Mon",
        value: "monday",
      },
      {
        text: "Tue",
        value: "tuesday",
      },
      {
        text: "Wed",
        value: "wednesday",
      },
      {
        text: "Thu",
        value: "thursday",
      },
      {
        text: "Fri",
        value: "friday",
      },
      {
        text: "Sat",
        value: "saturday",
      },
    ],

    standardRoom: [
      {
        rate: "Regular rate",
        sunday: 1000,
        monday: 1000,
        tuesday: 1000,
        wednesday: 1000,
        thursday: 1000,
        friday: 1000,
        saturday: 1000,
      },
      {
        rate: "Special rate",
        sunday: 700,
        monday: 700,
        tuesday: 700,
        wednesday: 700,
        thursday: 700,
        friday: 700,
        saturday: 700,
      },
    ],

    deluxeRoom: [
      {
        rate: "Regular rate",
        sunday: 1000,
        monday: 1000,
        tuesday: 1000,
        wednesday: 1000,
        thursday: 1000,
        friday: 1000,
        saturday: 1000,
      },
    ],

    presidentialRoom: [
      {
        rate: "Regular rate",
        sunday: 1000,
        monday: 1000,
        tuesday: 1000,
        wednesday: 1000,
        thursday: 1000,
        friday: 1000,
        saturday: 1000,
      },
      {
        rate: "Special rate",
        sunday: 700,
        monday: 700,
        tuesday: 700,
        wednesday: 700,
        thursday: 700,
        friday: 700,
        saturday: 700,
      },
    ],

    menuList: [
      {
        option: "Edit regular rate",
      },
      {
        option: "Edit special rate",
      },
      {
        option: "View details",
      },
      {
        option: "Remove category",
      },
    ],

    roomTypes: [
      {
        room: "STANDARD ROOM",
        discount: "DreamStay Discount",
        discountDate: "February 10, 2024 - March 10, 2024",
      },
      {
        room: "DELUXE ROOM",
        discount: null,
        discountDate: null,
      },
      {
        room: "PRESIDENTIAL ROOM",
        discount: "DreamStay Discount",
        discountDate: "February 10, 2024 - March 10, 2024",
      },
    ],
  }),
  methods: {
    tableContent: function (room) {
      if (room === "STANDARD ROOM") {
        return this.standardRoom;
      } else if (room === "DELUXE ROOM") {
        return this.deluxeRoom;
      } else if (room === "PRESIDENTIAL ROOM") {
        return this.presidentialRoom;
      }
    },
    listTitleColor: function (option) {
      if (option === "Remove category"){
        return "red--text"
      } else {
        return "black--text"
      }
    }
  },
  computed: {},
};
</script>

<style scoped>
.price-table {
  background-color: transparent;
}
</style>
