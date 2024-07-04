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
          <v-btn
            icon
            outlined
            color="red"
            @click="dialogActivator"
            class="absolute-position"
            ><v-icon>mdi-trash-can-outline</v-icon></v-btn
          >
        </v-col>
      </v-row>
      <v-divider :class="classDivider"></v-divider>
      <v-row>
        <v-col class="text-body-2">
          <span class="font-weight-bold grey--text" :cols="detailCols"
            >ADDRESS:</span
          >
          {{ guest.city }}, {{ guest.province }}</v-col
        >
        <v-col class="text-body-2" :cols="detailCols"
          ><span class="font-weight-bold grey--text">EMAIL:</span>
          {{ guest.email }}</v-col
        >
        <v-col class="text-body-2" :cols="detailCols"
          ><span class="font-weight-bold grey--text">PHONE:</span>
          {{ guest.phone }}</v-col
        >
        <v-col class="text-body-2" :cols="detailCols"
          ><span class="font-weight-bold grey--text">ID NUMBER:</span>
          {{ guest.idNumber }}</v-col
        >
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card elevation="0">
            <v-card-title class="text-subtitle-2 font-weight-black ml-3">
              {{ tableHeader }}
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                rounded
                v-if="show && !$vuetify.breakpoint.xs"
                class="text-button"
                justify="space-around"
                @click="searchFunction"
                ><v-icon left>mdi-magnify</v-icon>Search</v-btn
              >
              <v-btn
                color="primary"
                icon
                v-if="show && $vuetify.breakpoint.xs"
                class="text-button"
                @click="searchFunction"
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
              <v-col>
                <span class="ml-2">Reference</span>
                <v-text-field
                  dense
                  outlined
                  hide-details="auto"
                  v-model="searchRefNum"
                ></v-text-field>
              </v-col>
              <v-col>
                <span class="ml-2">Check-in Date</span>
                <v-menu
                  v-model="menuCheckIn"
                  :close-on-content-click="false"
                  offset-y
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="searchCheckIn"
                      v-on="on"
                      v-bind="attrs"
                      outlined
                      dense
                      readonly
                      hide-details="auto"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="searchCheckIn"
                    @input="menuCheckIn = false"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <span class="ml-2">Check-out Date</span>
                <v-menu
                  v-model="menuCheckOut"
                  :close-on-content-click="false"
                  offset-y
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="searchCheckOut"
                      v-on="on"
                      v-bind="attrs"
                      outlined
                      dense
                      readonly
                      hide-details="auto"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="searchCheckOut"
                    @input="menuCheckOut = false"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row v-if="show" class="mt-n5">
              <v-col class="d-flex justify-end mr-3 pb-0">
                <v-btn text color="warning" :ripple="false" @click="clearQuery">
                  Clear
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="guestTransactions"
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
      :deleteMeta="meta"
      @reset-activator="resetActivator"
      @delete-event="deleteRequest"
    />
  </v-container>
</template>

<script>
import DeleteDialog from "../dialogs/DeleteDialog.vue";
import { format, parseISO } from "date-fns";

export default {
  name: "GuestDetails",
  components: { DeleteDialog },
  props: {
    guest: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
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
    statusColors: {
      "checked-in": "checkedin",
      "checked-out": "checkedout",
      reserved: "reserved",
      confirmed: "confirmed",
    },
    show: false,
    indeterminate: true,
    value: 0,
    classGuestName: "text-h6 font-weight-bold",
    textfieldCols: 4,
    small: true,
    xSmall: false,
    classDivider: "my-3",
    detailCols: "3",
    title: "text-h5 font-weight-bold",
    deleteDialog: false,
    meta: {},
    confirmationRoute: ["RESERVED"],
    checkInCheckOutRoute: ["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"],
    menuCheckIn: false,
    menuCheckOut: false,
    searchRefNum: "",
    searchCheckIn: "",
    searchCheckOut: "",
    query_params: {},
  }),
  methods: {
    dialogActivator: function () {
      this.meta.targetDeletion = "guest";
      this.deleteDialog = true;
    },
    resetActivator: function () {
      this.deleteDialog = false;
    },
    deleteRequest: function () {
      this.$emit("delete-guest", this.guest.id);
      this.deleteDialog = false;
    },
    pushToTransactionRoute: function (value) {
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
    searchFunction: function () {
      let triggerIndeterminate = false;

      if (this.searchRefNum) {
        this.query_params.referenceNumber = this.searchRefNum;
        triggerIndeterminate = true;
      }
      if (this.searchCheckIn) {
        this.query_params.checkInDate = this.searchCheckIn;
        triggerIndeterminate = true;
      }
      if (this.searchCheckOut) {
        this.query_params.checkOutDate = this.searchCheckOut;
        triggerIndeterminate = true;
      }

      if (triggerIndeterminate === true) {
        this.indeterminate = true;
        setTimeout(() => {
          this.indeterminate = false;
        }, 3000);
        this.value = 100;
      }

      this.$emit("query-params", this.query_params);
    },
    clearQuery: function () {
      let triggerIndeterminate = false;

      if (this.searchRefNum) {
        this.searchRefNum = "";
        triggerIndeterminate = true;
      }
      if (this.searchCheckIn) {
        this.searchCheckIn = "";
        triggerIndeterminate = true;
      }
      if (this.searchCheckOut) {
        this.searchCheckOut = "";
        triggerIndeterminate = true;
      }

      this.query_params = {};

      if (triggerIndeterminate === true) {
        this.indeterminate = true;
        setTimeout(() => {
          this.indeterminate = false;
        }, 3000);
        this.value = 100;
      }

      this.$emit("query-params", this.query_params);
    },
  },
  computed: {
    size() {
      return this.$vuetify.breakpoint;
    },
    tableHeader: function () {
      if (this.guest.transactions.length === 0) {
        return "NO ITEMS FOUND";
      } else if (this.guest.transactions.length === 1) {
        return this.guest.transactions.length + " ITEM";
      } else if (this.guest.transactions.length > 1) {
        return this.guest.transactions.length + " ITEMS";
      }
    },
    guestTransactions: function () {
      return this.guest.transactions
        ? this.guest.transactions.map((content) => ({
            status: content.status,
            reference: content.reference,
            occupants: content.ocupants,
            checkIn: content.checkIn,
            checkOut: content.checkOut,
            booked: format(parseISO(content.booked), "yyyy-MM-dd"),
            room: "Room " + content.room,
            total: content.total,
          }))
        : [];
    },
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
    searchRefNum: {
      handler: function () {
        if (!this.searchRefNum || this.searchRefNum === "") {
          this.indeterminate = true;
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.referenceNumber;
          this.$emit("query-params", this.query_params);
        }
      },
    },
    searchCheckIn: {
      handler: function () {
        if (!this.searchCheckIn || this.searchCheckIn === "") {
          this.indeterminate = true;
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.checkInDate;
          this.$emit("query-params", this.query_params);
        }
      },
    },
    searchCheckOut: {
      handler: function () {
        if (!this.searchCheckOut || this.searchCheckOut === "") {
          this.indeterminate = true;
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.checkOutDate;
          this.$emit("query-params", this.query_params);
        }
      },
    },
    size: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.xs) {
          this.classGuestName = "font-weight-bold text-h6 text-center mt-n3";
          this.textfieldCols = 12;
          this.small = false;
          this.xSmall = true;
          this.classDivider = "my-3";
          this.detailCols = 12;
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
          this.detailCols = 3;
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

.relative-position {
  position: relative;
  right: 40px;
  top: -15px;
}
</style>
