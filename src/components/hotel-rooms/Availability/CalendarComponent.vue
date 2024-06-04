<template>
  <v-container class="pa-0" v-if="enums">
    <!-- Room Categories -->
    <v-row dense justify="space-between" class="py-4 py-sm-8">
      <v-col
        v-for="(i, index) in roomTypeEnum"
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
          :items="roomTypeEnum"
          item-text="roomType"
          label="Select a Room"
          v-model="activeButton"
        ></v-autocomplete>
      </v-col>
    </v-row>

    <!-- Calendar Component Card -->
    <v-card class="pa-5" flat>
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-btn
            outlined
            icon
            color="primary"
            class="mr-4"
            @click="triggerActivator"
            ><v-icon>mdi-filter-variant</v-icon></v-btn
          >
          <div style="max-width: 300px">
            <v-autocomplete
              class="d-block"
              rounded
              dense
              filled
              background-color="lightBg"
              hide-details="auto"
              :items="roomNumberEnum"
              item-text="roomNumber"
              v-model="dropdownValue"
            ></v-autocomplete>
          </div>
        </div>
        <div class="ml-4 ml-sm-0">
          <v-btn
            rounded
            color="primary"
            depressed
            class="d-none d-sm-block"
            @click="pushToBooking"
            ><v-icon left>mdi-plus</v-icon>Reserve</v-btn
          >
          <v-btn
            icon
            rounded
            color="white"
            class="primary d-block d-sm-none"
            @click="pushToBooking"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </div>
      </div>

      <v-divider class="my-4" />

      <div
        class="d-flex justify-start justify-sm-end flex-wrap flex-sm-nowrap align-center my-4"
      >
        <div
          class="d-flex justify-start align-center text-subtitle-2 font-weight-regular ml-0 ml-sm-4 mr-4 mr-sm-0"
          v-for="(data, index) in legendsData"
          :key="index"
        >
          <div :class="`${getEventColor(data)}`" class="chips mr-2"></div>
          <div>{{ data }}</div>
        </div>
      </div>

      <!-- Calendar Controls -->
      <v-row
        dense
        :justify="breakpoints.calendarJustify"
        align="center"
        class="mt-4 my-sm-4"
      >
        <v-col cols="auto">
          <v-btn outlined color="grey darken-2" @click="setToday">
            Today
          </v-btn>
        </v-col>
        <v-col cols="auto" :order="breakpoints.chevronLeft.order">
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon :small="breakpoints.chevronLeft.iconSize">
              mdi-chevron-left
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto" :order="breakpoints.chevronRight.order">
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon :small="breakpoints.chevronLeft.iconSize">
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto" class="d-none d-sm-block">
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
        </v-col>
        <v-spacer class="d-none d-sm-block"></v-spacer>
        <v-col cols="auto">
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-spacer class="d-block d-sm-none"></v-spacer>
        <v-col cols="auto" class="d-block d-sm-none" order="last">
          <div v-if="$refs.calendar" class="text-h6 font-weight-regular">
            {{ $refs.calendar.title }}
          </div>
        </v-col>
      </v-row>

      <!-- Calendar Scheduler -->
      <div class="mt-4">
        <v-sheet :height="breakpoints.calendarBreakpoint">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="mappedCalendarData"
            :event-color="getEventColor"
            :event-height="sizeEvents"
            event-more
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            interval-count="0"
          >
            <template v-slot:event="{ event }">
              <div v-if="formatEvents.includes(type) && type !== 'day'">
                <div class="font-weight-regular px-2">
                  {{ event.client !== null ? event.client : "" }}
                </div>
              </div>
              <v-container
                class="d-flex justify-center"
                style="max-width: 100%; max-height: 100%"
                v-else
              >
                <v-row no-gutters>
                  <v-col cols="auto">
                    <div class="text-overline font-weight-bold">
                      {{ event.name }}
                    </div>
                    <div class="text-subtitle-1">
                      {{ event.client ? event.client : event.status }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
            max-width="400"
          >
            <v-card color="white">
              <!-- Information -->
              <div class="pa-6">
                <div class="text-subtitle-1 font-weight-bold text-uppercase">
                  <div class="mb-1">
                    {{
                      selectedEvent.client !== null
                        ? selectedEvent.client
                        : "Not Available"
                    }}
                  </div>
                  <div class="d-flex align-center">
                    <v-chip
                      :color="getEventColor(selectedEvent)"
                      class="text-outline white--text"
                      small
                      >{{ selectedEvent.status }}</v-chip
                    >
                    <div
                      class="d-flex text-caption font-weight-regular grey--text text--darken-2 text-capitalize"
                    >
                      <div class="mx-2">
                        {{ this.activeButton }}
                      </div>
                      <v-divider vertical></v-divider>
                      <div class="mx-2">
                        {{ selectedEvent.name }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="mt-2 mt-sm-4"
                  v-for="(sched, index) in selectedEvent.schedule"
                  :key="index"
                >
                  <div
                    class="text-caption font-weight-bold grey--text text--darken-2"
                  >
                    {{ sched.title }}
                  </div>
                  <div class="text-subtitle-2 font-weight-regular mb-2">
                    {{ sched.time }}
                  </div>
                </div>
              </div>

              <v-divider />

              <v-card-actions
                class="d-flex flex-column align-center justify-center px-6 py-4"
              >
                <v-btn
                  :disabled="selectedEvent.status === 'HOUSEKEEPING'"
                  :color="getEventColor(selectedEvent)"
                  outlined
                  block
                  @click="requestRouteChange(selectedEvent)"
                  >View Details</v-btn
                >

                <v-btn
                  color="warning"
                  text
                  block
                  class="ml-0 mt-2"
                  @click="selectedOpen = false"
                  >Close</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </div>
    </v-card>
    <calendar-filter-dialog
      :activator="filterDialog"
      @reset-activator="resetActivator"
      @request-filter="requestFilter"
    />
  </v-container>
</template>

<script>
import CalendarFilterDialog from "../../dialogs/CalendarFilterDialog.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "CalendarComponent",
  props: {
    calendarData: {
      required: true,
    },
  },
  components: {
    CalendarFilterDialog,
  },
  data: () => ({
    filterDialog: false,
    activeButton: "JUNIOR STANDARD",
    dropdownValue: "",
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    queryParams: {
      roomType: null,
      roomNumber: null,
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    legendsData: [
      "Housekeeping",
      "Checked-out",
      "Checked-in",
      "Reserved",
      "Confirmed",
    ],
    breakpoints: {
      calendarJustify: "center",
      chevronLeft: {},
      chevronRight: {},
      calendarBreakpoint: "",
    },
  }),
  created() {
    this.requestEnums();
  },
  methods: {
    ...mapActions("roomTypeEnum", ["fetchRoomTypes"]),
    ...mapActions("roomNumberEnum", ["fetchRoomNumbers"]),

    // Calendar Values
    activeValue(value) {
      this.activeButton = value;
    },
    getEventColor(event) {
      let color = null;
      if (event.status === "CONFIRMED" || event === "Confirmed") {
        color = "confirmed";
      } else if (event.status === "CHECKED-IN" || event === "Checked-in") {
        color = "checkedin";
      } else if (event.status === "CHECKED-OUT" || event === "Checked-out") {
        color = "checkedout";
      } else if (event.status === "HOUSEKEEPING" || event === "Housekeeping") {
        color = "housekeeping";
      } else if (event.status === "RESERVED" || event === "Reserved") {
        color = "reserved";
      }
      return color;
    },

    // Calendar Native Methods
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },

    // Calendar Methods
    formatDate(date) {
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedDate} - ${formattedTime}`;
    },
    pushToBooking: function () {
      let payload = {
        room: {
          type: this.activeButton,
          details: this.filteredRoom(this.dropdownValue),
        },
      };
      this.$router.push({
        name: "Booking",
        query: {
          room: JSON.stringify(payload),
        },
      });
    },
    requestRouteChange: function (event) {
      this.$emit("route-event", event);
    },
    requestEnums: function () {
      this.fetchRoomTypes();
    },
    filteredRoom: function (room) {
      const filteredRoom = this.roomNumberEnum.filter(
        (item) => item.roomNumber === room
      );
      return filteredRoom[0];
    },
    requestQuery: function (newVal) {
      const payload = {
        roomType: newVal,
      };
      this.fetchRoomNumbers(payload);
    },

    // Filter Methods
    resetActivator: function (newVal) {
      this.filterDialog = newVal;
    },
    triggerActivator: function () {
      this.filterDialog = !this.filterDialog;
    },
    requestFilter: function (payload) {
      const queryParams = {
        dateRange: payload,
      };

      if (payload.length === 0) {
        queryParams.dateRange = null;
      }

      this.assignParams(queryParams);

      if (payload.length > 0) {
        this.focus = payload[0];
        this.type = "week";
      } else {
        this.focus = "";
        this.type = "month";
      }
    },
    assignParams(payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          const value = payload[key];
          if (value === null) {
            // if value is null, delete in query_params
            this.$delete(this.queryParams, key);
          } else {
            // if property has data, add to query_params
            this.$set(this.queryParams, key, value);
          }
        }
      }
    },
  },
  computed: {
    ...mapState("roomTypeEnum", ["roomTypeEnum"]),
    ...mapState("roomNumberEnum", ["roomNumberEnum"]),
    sizeEvents() {
      return this.type === "day" ? 85 : 20;
    },
    formatEvents() {
      return ["month", "week", "4day"];
    },
    size() {
      return this.$vuetify.breakpoint;
    },
    enums() {
      return this.roomTypeEnum && this.roomNumberEnum;
    },
    mappedCalendarData() {
      return this.calendarData
        ? this.calendarData.map((item) => ({
            name: item.roomNumber,
            start: new Date(item.checkIn),
            end: new Date(item.checkOut),
            schedule: [
              {
                title: "From:",
                time: this.formatDate(item.checkIn),
              },
              {
                title: "To:",
                time: this.formatDate(item.checkOut),
              },
              {
                title: "Checked In:",
                time: item.transactionHistory.checkIn
                  ? this.formatDate(item.transactionHistory.checkIn)
                  : "Pending",
              },
              {
                title: "Checked Out:",
                time: item.transactionHistory.checkOut
                  ? this.formatDate(item.transactionHistory.checkOut)
                  : "Pending",
              },
            ],
            status: item.status,
            client: item.guest,
            referenceNumber: item.referenceNumber,
          }))
        : [];
    },
  },
  watch: {
    activeButton: {
      immediate: true,
      handler(newVal) {
        this.requestQuery(newVal);
        this.queryParams.roomType = newVal;
      },
    },
    roomTypeEnum: {
      deep: true,
      handler: function (newVal) {
        this.activeButton = newVal[0].roomType;
      },
    },
    roomNumberEnum: {
      deep: true,
      handler: function (newVal) {
        this.dropdownValue = newVal[0].roomNumber;
        this.queryParams.roomNumber = newVal[0].roomNumber;
      },
    },
    queryParams: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.$emit("calendar-event", newVal);
      },
    },
    dropdownValue: {
      immediate: true,
      handler: function (newVal) {
        this.queryParams.roomNumber = newVal;
      },
    },
    size: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (newVal.xs || newVal.sm) {
          this.breakpoints.calendarJustify = "space-around";
          this.breakpoints.chevronLeft.iconSize = false;
          this.breakpoints.chevronRight.iconSize = false;
          this.breakpoints.chevronLeft.order = "3";
          this.breakpoints.chevronRight.order = "4";
          this.breakpoints.calendarBreakpoint = newVal.thresholds.xs;
        } else {
          this.breakpoints.calendarJustify = "center";
          this.breakpoints.chevronLeft.iconSize = true;
          this.breakpoints.chevronRight.iconSize = true;
          this.breakpoints.chevronLeft.order = "";
          this.breakpoints.chevronRight.order = "";
          this.breakpoints.calendarBreakpoint = newVal.thresholds.sm;
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
.chips {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-left: 0.2rem;
}
</style>
