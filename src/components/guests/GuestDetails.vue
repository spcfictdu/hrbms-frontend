<template>
  <v-container>
    <div
      :class="{
        'xl-padding mt-n3': $vuetify.breakpoint.xl,
        'px-sm-2 mx-md-n3 my-md-5 mx-sm-n3 my-sm-n3':
          $vuetify.breakpoint.lgAndDown,
      }"
    >
      <v-row v-if="!$vuetify.breakpoint.xs">
        <v-col cols="12">
          <div :class="title">Guest Details</div>
        </v-col>
      </v-row>
      <v-divider v-if="!$vuetify.breakpoint.xs" :class="classDivider" />
      <v-row>
        <v-col>
          <div :class="classGuestName">
            {{ name }}
          </div>
        </v-col>
        <v-spacer v-if="!$vuetify.breakpoint.xs"></v-spacer>
        <v-col cols="auto" v-if="!$vuetify.breakpoint.xs">
          <v-btn outlined color="red" @click="dialogActivator"
            >DELETE GUEST DETAILS</v-btn
          >
        </v-col>
        <v-col cols="auto" v-else>
          <v-btn icon outlined color="red" @click="dialogActivator"
            ><v-icon>mdi-trash-can-outline</v-icon></v-btn
          >
        </v-col>
      </v-row>
      <v-divider :class="classDivider"></v-divider>
      <v-row>
        <v-col
          :cols="detailCols"
          v-for="(detail, index) in guestDetails"
          :key="index"
          class="text-body-2"
        >
          <span class="font-weight-bold grey--text">{{ detail.title }}:</span>
          <span> {{ detail.content }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card elevation="0">
            <v-card-title class="text-subtitle-2 font-weight-black ml-3"
              >{{ stayStatus.length }} ITEMS
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                rounded
                v-if="show && !$vuetify.breakpoint.xs"
                class="text-button"
                justify="space-around"
                ><v-icon left>mdi-magnify</v-icon>Search</v-btn
              >
              <v-btn
                color="primary"
                icon
                v-if="show && $vuetify.breakpoint.xs"
                class="text-button"
                ><v-icon>mdi-magnify</v-icon></v-btn
              >
              <v-btn
                fab
                outlined
                :small="small"
                :x-small="xSmall"
                @click="show = !show"
                color="primary"
                class="ml-2"
              >
                <v-icon>{{
                  show ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
              </v-btn>
            </v-card-title>
            <v-row>
              <v-col cols="12">
                <v-progress-linear
                  color="amber"
                  :indeterminate="indeterminate"
                  :value="value"
                ></v-progress-linear>
              </v-col>
            </v-row>
            <v-row v-if="show" class="mx-3 text-subtitle-2">
              <v-col
                v-for="(header, index) in textfieldHeaders"
                :key="index"
                :cols="textfieldCols"
              >
                <span class="ml-2">{{ header }}</span>
                <v-text-field dense outlined hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="stayStatus"
                  class="ma-5"
                >
                  <template v-slot:[`item.status`]="{ item }">
                    <v-chip
                      :color="statusColors[item.status.toLowerCase()]"
                      dark
                      small
                      class="text-overline"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <DeleteDialog :activator="deleteDialog" @reset-activator="resetActivator" />
  </v-container>
</template>

<script>
import { watch } from "vue";
import DeleteDialog from "../dialogs/DeleteDialog.vue";
export default {
  name: "GuestDetails",
  components: { DeleteDialog },
  data: () => ({
    name: "Dela Cruz, Juan Flores",
    guestDetails: [
      {
        title: "ADDRESS",
        content: "Angeles City, Pampanga",
      },
      {
        title: "EMAIL",
        content: "juan.delacruz@gmail.com",
      },
      {
        title: "PHONE",
        content: "09123456789",
      },
      {
        title: "ID NUMBER",
        content: "0528305-4102-583258 - National ID",
      },
    ],
    headers: [
      { text: "Status", value: "status" },
      { text: "Reference", value: "reference" },
      { text: "Occupants", value: "occupants" },
      { text: "Check-in", value: "checkIn" },
      { text: "Check-out", value: "checkOut" },
      { text: "Booked", value: "booked" },
      { text: "Room", value: "room" },
      { text: "Total", value: "total" },
    ],
    stayStatus: [
      {
        status: "Checked-out",
        reference: "BKG-987654-20240514",
        occupants: 5,
        checkIn: "05-10-2024",
        checkOut: "05-15-2024",
        booked: "05-09-2024",
        room: "Room 147",
        total: "5000",
      },
      {
        status: "Checked-out",
        reference: "BKG-987654-20240514",
        occupants: 5,
        checkIn: "05-10-2024",
        checkOut: "05-15-2024",
        booked: "05-09-2024",
        room: "Room 147",
        total: "5000",
      },
      {
        status: "Checked-out",
        reference: "BKG-987654-20240514",
        occupants: 5,
        checkIn: "05-10-2024",
        checkOut: "05-15-2024",
        booked: "05-09-2024",
        room: "Room 147",
        total: "5000",
      },
    ],
    statusColors: {
      "checked-in": "checkedin",
      "checked-out": "checkedout",
      reserved: "reserved",
      confirmed: "confirmed",
    },
    show: false,
    textfieldHeaders: ["Reference", "Check-in Date", "Check-out Date"],
    indeterminate: true,
    value: 0,
    classGuestName: "text-h6 font-weight-bold",
    textfieldCols: 4,
    small: true,
    xSmall: false,
    classDivider: "my-3",
    detailCols: "auto",
    title: "text-h5 font-weight-bold",
    deleteDialog: false,
  }),
  methods: {
    // statusColor: function (status) {
    //   if (status === "Checked-in") return "green";
    //   else if (status === "Checked-out") return "orange";
    //   else if (status === "Reserved") return "pink";
    //   else return "indigo";
    // },
    dialogActivator: function () {
      this.deleteDialog = !this.deleteDialog;
    },
    resetActivator: function () {
      this.deleteDialog = !this.deleteDialog;
    },
  },
  computed: {
    detailLabels() {
      return Object.keys(this.guestDetails);
    },
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },
  watch: {
    deleteDialog: {
      handler(value) {
        console.log(value);
      },
    },
    stayStatus: {
      immediate: true,
      handler(value) {
        if (value.length) {
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
        } else {
          this.indeterminate = false;
        }
      },
    },
    size: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.xs) {
          this.classGuestName =
            "d-flex font-weight-bold text-h6 justify-center";
          this.textfieldCols = 12;
          this.small = false;
          this.xSmall = true;
          this.classDivider = "my-3";
          this.detailCols = "auto";
        } else if (newVal.md || newVal.sm) {
          this.detailCols = 6;
          this.textfieldCols = 4;
          this.small = true;
          this.xSmall = false;
          this.classDivider = "my-3";
          if (newVal.sm) {
            this.title = "text-h6 font-weight-bold";
            this.classGuestName = "text-subtitle-1 font-weight-bold";
          }
        } else {
          this.classGuestName = "text-h6 font-weight-bold";
          this.textfieldCols = 4;
          this.small = true;
          this.xSmall = false;
          this.classDivider = "my-3";
          this.detailCols = "auto";
          this.title = "text-h5 font-weight-bold";
        }
      },
    },
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 288px 0 288px;
}
</style>
