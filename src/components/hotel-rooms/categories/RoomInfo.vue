<template>
  <div>
    <div class="d-flex flex-row align-start justify-space-between mb-4 mb-md-0">
      <div>
        <p class="text-h6 font-weight-bold mb-0">
          {{ room.name.toUpperCase() }}
        </p>
        <p class="text-subtitle-2 font-weight-regular">
          <PriceSlot>
            <template v-slot:price> {{ room.price }} </template>
          </PriceSlot>
          {{ ` | ${room.maxOccupancy} max occupancy` }}
        </p>
      </div>

      <div class="d-flex">
        <v-menu left offset-x>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs" icon outlined color="primary"
              ><v-icon small>mdi-pencil</v-icon></v-btn
            >
          </template>
          <v-list dense class="py-0">
            <v-list-item
              :class="{
                'menu-border': index < menuItems.length - 1,
                'warning--text': iter.text === 'Remove category',
              }"
              v-for="(iter, index) in menuItems"
              :key="index"
              @click="iter.action()"
            >
              <v-list-item-title class="text-body-2 font-weight-regular">{{
                iter.text
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <div>
      <p class="text-body-2 longText--text">
        {{ room.description }}
      </p>
    </div>

    <v-divider class="mb-5 mt-7" />

    <div>
      <p class="text-overline font-weight-bold">Amenities</p>
      <div>
        <v-chip
          outlined
          small
          class="mr-2 mb-1 text-subtitle-2"
          v-for="(amenity, i) in room.amenities"
          :key="i"
          :color="i % 2 === 0 ? 'primary' : 'accentOne'"
          >{{ capitalizeString(amenity) }}</v-chip
        >
      </div>
    </div>

    <v-divider class="mb-5 mt-7" />

    <div>
      <div
        class="d-flex flex-md-row flex-column justify-md-space-between align-md-center"
      >
        <p class="text-overline font-weight-bold">Price Rates</p>
        <p class="text-caption font-weight-regular">
          {{ discountDates }}
          <span class="ml-md-2">
            <v-chip small color="primary" outlined class="text-subtitle-2">{{
              discountChip
            }}</v-chip>
          </span>
        </p>
      </div>
      <v-data-table
        elevation="0"
        dense
        hide-default-footer
        class="price-table"
        :headers="headers"
        :items="room.prices"
        :items-per-page="5"
        @click:row="(row) => assignValues(row)"
      ></v-data-table>
      <div class="mt-2 text-caption grey--text text--darken-2 text-right">
        *click a row to view its discount range
      </div>
    </div>

    <!-- <v-divider class="mb-5 mt-7" />
    <div>
      <div class="d-flex justify-space-between mb-4 mb-md-0">
        <p class="text-overline font-weight-bold">Rooms List</p>
        <v-btn icon outlined color="primary"
          ><v-icon small>mdi-pen-plus</v-icon></v-btn
        >
      </div>

      <v-row dense>
        <v-col cols="12" v-for="(iter, index) in room.rooms" :key="index">
          <RoomListCard :room="iter" />
        </v-col>
      </v-row>
    </div> -->
    <rate-dialog
      :activator="rateDialog"
      :rateMeta="rateMeta"
      @reset-activator="resetActivator"
    />
    <delete-dialog
      :activator="deleteDialog"
      @reset-activator="resetDeleteActivator"
      :deleteMeta="deleteMeta"
    />
  </div>
</template>

<script>
import PriceSlot from "../../slots/PriceSlot.vue";
// import RoomListCard from "./RoomListCard.vue";
import RateDialog from "@/components/dialogs/RateDialog.vue";
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue";
export default {
  name: "RoomInfo",
  props: {
    room: Object,
  },
  components: {
    PriceSlot,
    // RoomListCard,
    RateDialog,
    DeleteDialog,
  },
  data: () => ({
    // Rate Dialog
    rateDialog: false,
    rateMeta: {
      typeOfAction: "",
      roomType: "",
      rateType: "",
      referenceNumber: "",
    },
    // Delete Dialog
    deleteDialog: false,
    deleteMeta: {
      targetDeletion: "",
    },
    // Miscellaneous
    discountChip: "Regular Rate",
    discountDates: "",
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
  }),
  methods: {
    capitalizeString(str) {
      const lowerCaseString = str.toLowerCase();
      return lowerCaseString
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
    assignValues: function (rowData) {
      this.discountChip = rowData.rate;
      this.discountDates =
        rowData.startDate && rowData.endDate
          ? this.formatDate(rowData.startDate, rowData.endDate)
          : "";
    },
    formatDate(start, end) {
      const formattedDateOne = new Date(start).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedDateTwo = new Date(end).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return `${formattedDateOne} - ${formattedDateTwo}`;
    },
    activateDialog: function (meta) {
      this.rateMeta = meta;
      this.rateDialog = !this.rateDialog;
    },
    resetActivator: function () {
      this.rateDialog = false;
    },
    activateDeleteDialog: function (meta) {
      this.deleteMeta = meta;
      this.deleteDialog = !this.deleteDialog;
    },
    resetDeleteActivator: function () {
      this.deleteDialog = false;
    },
  },
  computed: {
    menuItems: function () {
      return [
        {
          text: "Edit regular rate",
          action: () => {
            let meta = {
              typeOfAction: "EDIT",
              roomType: this.room.name,
              rateType: "regular",
            };
            this.activateDialog(meta);
          },
        },
        {
          text: "Edit special rate",
          action: () => {
            let meta = {
              typeOfAction: "EDIT",
              roomType: this.room.name,
              rateType: "special",
            };
            this.activateDialog(meta);
          },
        },
        {
          text: "Remove category",
          action: () => {
            let meta = {
              targetDeletion: "category",
            };
            this.activateDeleteDialog(meta);
          },
        },
      ];
    },
  },
};
</script>

<style scoped>
.price-table {
  background-color: transparent;
}
.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
