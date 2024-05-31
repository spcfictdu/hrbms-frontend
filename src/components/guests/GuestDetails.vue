<template>
  <v-container>
    <div
      :class="{
        'xl-padding mt-n6': $vuetify.breakpoint.xl,
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
            {{ guest.fullName }}
          </div>
        </v-col>
        <v-spacer v-if="!$vuetify.breakpoint.xs"></v-spacer>
        <v-col cols="auto" v-if="!$vuetify.breakpoint.xs">
          <v-btn outlined color="red" @click="dialogActivator"
            >DELETE GUEST DETAILS</v-btn
          >
        </v-col>
        <v-col cols="auto" v-else class="relative-position">
          <v-btn icon outlined color="red" @click="dialogActivator" class="absolute-position"
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
              >{{ guest.transactions.length }}
              {{ guest.transactions.length < 1 ? "ITEMS" : "ITEM" }}
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
                  :items="guest.transactions"
                  class="ma-5"
                  @click:row="(v) => pushToTransactionRoute(v)"
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
    <DeleteDialog
      :activator="deleteDialog"
      @reset-activator="resetActivator"
      @delete-guest="deleteEvent"
    />
  </v-container>
</template>

<script>
import DeleteDialog from "../dialogs/DeleteDialog.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "GuestDetails",
  components: { DeleteDialog },
  data: () => ({
    headers: [
      { text: "Status", value: "status" },
      { text: "Reference", value: "reference" },
      { text: "Occupants", value: "ocupants" },
      { text: "Check-in", value: "checkIn" },
      { text: "Check-out", value: "checkOut" },
      { text: "Booked", value: "booked" },
      { text: "Room", value: "room" },
      { text: "Total", value: "total" },
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
    confirmationRoute: ["RESERVED"],
    checkInCheckOutRoute: ["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"],
  }),
  methods: {
    ...mapActions("guest", ["fetchGuest", "deleteGuest"]),
    dialogActivator: function () {
      this.deleteDialog = !this.deleteDialog;
    },
    resetActivator: function () {
      this.deleteDialog = !this.deleteDialog;
    },
    deleteEvent: function () {
      this.deleteGuest(this.guest.id)
        .catch((error) => {
          console.log("Error deleting guest: ", error);
        })
        .finally(() => {
          this.resetActivator;
        });
    },
    fetchGuestDetails: function () {
      const id = this.$route.params.id;
      this.fetchGuest(id).catch((error) => {
        console.error("Error fetching guest details: ", error);
      });
    },
    pushToTransactionRoute: function (value) {
      console.log(value);
      let payload = {
        status: value.status,
        referenceNumber: value.reference,
      };
      if (this.confirmationRoute.includes(payload.status)) {
        this.$router.push({
          name: "Confirmation",
          params: {
            referenceNumber: payload.referenceNumber,
          },
        });
      } else if (this.checkInCheckOutRoute.includes(payload.status)) {
        this.$router.push({
          name: "CheckInOut",
          params: {
            referenceNumber: payload.referenceNumber,
          },
        });
      }
    },
  },
  computed: {
    ...mapState("guest", {
      guest: "guest",
    }),
    size() {
      return this.$vuetify.breakpoint;
    },
    guestDetails() {
      let guestDetails = [];

      Object.keys(this.guest).forEach((detail) => {
        if (detail.includes("city")) {
          guestDetails.unshift({
            title: "ADDRESS",
            content: this.guest["city"] + ", " + this.guest["province"],
          });
        } else if (detail.includes("email")) {
          guestDetails.push({
            title: "EMAIL",
            content: this.guest[detail],
          });
        } else if (detail.includes("phone")) {
          guestDetails.push({
            title: "PHONE",
            content: this.guest[detail],
          });
        } else if (detail.includes("idNumber")) {
          guestDetails.push({
            title: "ID NUMBER",
            content: this.guest[detail],
          });
        }
      });

      return guestDetails;
    },
  },
  created() {
    this.fetchGuestDetails();
  },
  watch: {
    "guest.transactions": {
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
            "font-weight-bold text-h6 text-center mt-n3";
          this.textfieldCols = 12;
          this.small = false;
          this.xSmall = true;
          this.classDivider = "my-3";
          this.detailCols = "12";
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

.absolute-position {
  position: absolute;

}

.relative-position{
  position: relative;
  right: 40px;
  top: -15px
}
</style>
