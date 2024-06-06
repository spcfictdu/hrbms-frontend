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
        <p class="text-subtitle-2 font-weight-bold">
          {{ room.room }}
        </p>
        <div class="d-flex align-center">
          <p class="text-caption font-weight-regular" v-if="room.discount">
            <span class="mr-md-2">
              <v-chip
                small
                color="primary"
                class="text-subtitle-2 white--text"
                >{{ room.discountName }}</v-chip
              >
            </span>
            {{ room.discountStart }} - {{ room.discountEnd }}
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
                  <v-list-item-title :class="listTitleColor(option.option)">{{
                    option.option
                  }}</v-list-item-title>
                  <v-divider class="mt-3" v-if="index < menuList.length - 1" />
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
      <!-- <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th
                v-for="(header, index) in headers"
                :key="index"
                class="text-left"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(day, index) in item.rates" :key="index">
              <td>{{ day.rateTypes }}</td>
              <td>{{ day.sunday }}</td>
              <td>{{ day.monday }}</td>
              <td>{{ day.tuesday }}</td>
              <td>{{ day.wednesday }}</td>
              <td>{{ day.thursday }}</td>
              <td>{{ day.friday }}</td>
              <td>{{ day.saturday }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table> -->
    </v-card>
    <EditRegularRate
      :activator="regularRateDialog"
      @reset-activator="resetActivator"
    />
    <EditSpecialRate
      :activator="specialRateDialog"
      @reset-activator="resetActivator"
    />
  </v-container>
</template>
<script>
import RoomsList from "../rooms/RoomsList.vue";
import EditRegularRate from "../../dialogs/EditRegularRate.vue";
import EditSpecialRate from "../../dialogs/EditSpecialRate.vue";
export default {
  name: "RoomPricing",
  components: { RoomsList, EditRegularRate, EditSpecialRate },
  props: {
    roomPrices: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    regularRateDialog: false,
    specialRateDialog: false,
    // headers: [
    //   {
    //     text: "Rates (in peso)",
    //   },
    //   {
    //     text: "Sun",
    //   },
    //   {
    //     text: "Mon",
    //   },
    //   {
    //     text: "Tue",
    //   },
    //   {
    //     text: "Wed",
    //   },
    //   {
    //     text: "Thu",
    //   },
    //   {
    //     text: "Fri",
    //   },
    //   {
    //     text: "Sat",
    //   },
    // ],
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

    juniorStandard: [
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
      if (option === "Remove category") {
        return "red--text";
      } else {
        return "black--text";
      }
    },
    resetActivator: function () {
      if (this.regularRateDialog) {
        this.regularRateDialog = !this.regularRateDialog;
      } else if (this.specialRateDialog) {
        this.specialRateDialog = !this.specialRateDialog;
      }
    },
  },
  computed: {
    // roomData() {
    //   return this.roomPrices
    //     ? this.roomPrices.map((key) => {
    //         let data = {
    //           roomMeta: {
    //             roomTitle: key.roomType.name,
    //             roomReferenceNumber: key.roomType.referenceNumber,
    //           },
    //           discountMeta: {},
    //           rates: [
    //             {
    //               rateTypes: "Regular rate",
    //               sunday: key.rates.regular.sunday,
    //               monday: key.rates.regular.monday,
    //               tuesday: key.rates.regular.tuesday,
    //               wednesday: key.rates.regular.wednesday,
    //               thursday: key.rates.regular.thursday,
    //               friday: key.rates.regular.friday,
    //               saturday: key.rates.regular.saturday,
    //               referenceNumber: key.rates.regular.referenceNumber, // Reference Number
    //             },
    //           ],
    //         };

    //         // data.rates.push({
    //         //   rateTypes: "Special rate",
    //         //   sunday: "1400",
    //         //   monday: "1400",
    //         //   tuesday: "1400",
    //         //   wednesday: "1400",
    //         //   thursday: "1400",
    //         //   friday: "1400",
    //         //   saturday: "1400",
    //         // });

    //         if (key.rates.special.length > 0) {
    //           data.discountMeta = {
    //             //
    //           }
    //           data.rates.push({
    //             rateTypes: "Special rate",
    //             sunday: key.rates.special.sunday,
    //             monday: key.rates.special.monday,
    //             tuesday: key.rates.special.tuesday,
    //             wednesday: key.rates.special.wednesday,
    //             thursday: key.rates.special.thursday,
    //             friday: key.rates.special.friday,
    //             saturday: key.rates.special.saturday,
    //           });
    //         }

    //         return data;
    //       })
    //     : [];
    // },
    roomTypes() {
      let rooms = [];

      Object.keys(this.roomPrices).forEach((outerIndex) => {
        const index = this.roomPrices[outerIndex];

        Object.keys(index).forEach((innerIndex) => {
          const roomIndex = index[innerIndex];

          Object.keys(roomIndex).forEach((roomType) => {
            if (roomType.includes("name")) {
              rooms.push({
                room: roomIndex[roomType],
              });
            }
            const special = roomIndex[roomType];

            Object.keys(special).forEach((specialIndex) => {
              const discount = special[specialIndex];

              rooms.forEach((room) => {
                Object.keys(discount).forEach((detail) => {
                  if (detail.includes("discountName")) {
                    Object.assign(room, { discountName: discount[detail] });
                  }
                  if (detail.includes("startDate")) {
                    Object.assign(room, { discountStart: discount[detail] });
                  }
                  if (detail.includes("endDate")) {
                    Object.assign(room, { discountEnd: discount[detail] });
                  }
                });
              });
            });
          });
        });
      });
      return rooms;
    },
  },
  watch: {
    roomTypes: {
      immediate: true,
      handler(value) {
        console.log(value);
      },
    },
  },
};
</script>

<style scoped>
.price-table {
  background-color: transparent;
}
</style>
