<template>
  <v-card>
    <v-row class="fill-height">
      <v-col cols="12">
        <v-sheet height="64">
          <v-row dense align="center">
            <v-col cols="auto">
              <v-btn outlined color="grey darken-2" @click="setToday">
                Today
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small> mdi-chevron-left </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small> mdi-chevron-right </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
            </v-col>
            <v-divider vertical class="mx-4"></v-divider>
            <v-col cols="auto" class="d-flex align-center">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    icon
                    :color="showLegend ? 'primary' : 'grey darken-2'"
                    class="mr-4"
                    @click="triggerTransition"
                  >
                    <v-icon>mdi-map-legend</v-icon>
                  </v-btn>
                </template>

                <span>Legends</span>
              </v-tooltip>

              <v-scroll-x-transition>
                <div v-show="showLegend">
                  <div class="d-flex justify-start align-center">
                    <div
                      class="d-flex justify-start align-center mr-5"
                      v-for="(data, index) in legendsData"
                      :key="index"
                    >
                      <div
                        :class="`chips ${getEventColor(data)}`"
                        class="mr-2"
                      ></div>
                      <div>{{ data }}</div>
                    </div>
                  </div>
                </div>
              </v-scroll-x-transition>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    outlined
                    color="grey darken-2"
                    class="mr-4"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <span>{{ typeToRooms[selectedRoomType] }}</span>
                    <v-icon right> mdi-menu-down </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="selectedRoomType = 'deluxe'">
                    <v-list-item-title>Deluxe</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="selectedRoomType = 'regular'">
                    <v-list-item-title>Regular</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="selectedRoomType = 'suite'">
                    <v-list-item-title>Suite</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col cols="auto">
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    outlined
                    color="grey darken-2"
                    v-bind="attrs"
                    v-on="on"
                  >
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
          </v-row>
        </v-sheet>
        <v-sheet>
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :event-height="sizeEvents"
            event-more
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
            interval-count="0"
          >
            <template v-slot:event="{ event }">
              <div v-if="formatEvents.includes(type) && type !== 'day'">
                <div class="font-weight-bold px-2">
                  {{ event.name
                  }}{{ event.client !== null ? " - " + event.client : "" }}
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
            <!-- <template #day-header>
            <div style="max-height: 10vh">
            test</div>
          </template> -->
          </v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar dark>
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title>
                  {{ selectedEvent.name }}
                </v-toolbar-title>
                <v-divider class="mx-4" vertical></v-divider>
                <v-toolbar-title>
                  {{ formatDate(selectedEvent.start) }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "CalendarComponent",
  data: () => ({
    focus: "",
    type: "month",
    selectedRoomType: "deluxe",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    typeToRooms: {
      deluxe: "Deluxe",
      regular: "Regular",
      suite: "Suite",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    rooms: null,
    roomNames: {
      deluxe: ["Deluxe 1"],
      regular: ["Regular 1", "Regular 2"],
      suite: ["Suite 1", "Suite 2"],
    },
    statuses: {
      withClient: ["Confirmed", "Checked-in", "Checked-out"],
      withoutClient: ["Unallocated", "Ready for Occupancy"],
    },
    clients: [
      "John Doe",
      "Jane Doe",
      "Michael Doe",
      "Theodore Doe",
      "Teddy Doe",
    ],
    showLegend: false,
    legendsData: [
      "Confirmed",
      "Checked-in",
      "Checked-out",
      "Unallocated",
      "Ready for Occupancy",
    ],
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    // this.updateRange();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      let color = null;
      if (event.status === "Confirmed" || event === "Confirmed") {
        color = "red";
      } else if (event.status === "Checked-in" || event === "Checked-in") {
        color = "primary";
      } else if (event.status === "Checked-out" || event === "Checked-out") {
        color = "grey";
      } else if (event.status === "Unallocated" || event === "Unallocated") {
        color = "blue lighten-3";
      } else if (
        event.status === "Ready for Occupancy" ||
        event === "Ready for Occupancy"
      ) {
        color = "success";
      }
      return color;
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
    updateRange() {
      const events = [];

      // Get today's date and set the time to the start of the day
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset time to midnight for consistency

      // Create an endDate that is 31 days after the currentDate
      const endDate = new Date(currentDate); // Clone currentDate
      endDate.setDate(endDate.getDate() + 31); // Add 31 days

      while (currentDate <= endDate) {
        const startTime = new Date(currentDate);
        startTime.setHours(14, 0, 0); // Set start time to 2:00 PM

        const endTime = new Date(startTime);
        endTime.setDate(endTime.getDate() + 1);
        endTime.setHours(11, 0, 0); // Set end time to 11:00 AM next day

        for (let i = 0; i <= 7; i++) {
          let client =
            Math.random() > 0.5
              ? this.clients[Math.floor(Math.random() * this.clients.length)]
              : null;
          let status =
            client !== null
              ? this.statuses.withClient[
                  Math.floor(Math.random() * this.statuses.withClient.length)
                ]
              : this.statuses.withoutClient[
                  Math.floor(Math.random() * this.statuses.withoutClient.length)
                ];

          events.push({
            name: this.rooms[i],
            start: startTime,
            end: endTime,
            status: status,
            client: client,
          });
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    triggerTransition() {
      this.showLegend = !this.showLegend;
    },
    formatDate(date) {
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return formattedDate;
    },
  },
  computed: {
    sizeEvents() {
      return this.type === "day" ? 85 : 20;
    },
    formatEvents() {
      return ["month", "week", "4day"];
    },
  },
  watch: {
    selectedRoomType: {
      immediate: true,
      handler(newVal) {
        this.rooms = this.roomNames[newVal];
        this.updateRange();
      },
    },
    // type: {
    //   handler(value) {
    //     console.log(this.formatEvents.includes(value) && this.type !== "day");
    //   },
    // },
  },
};
</script>

<style>
.chips {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 0.2rem;
}

/* .v-calendar-weekly__day.v-future > div[style='height: 21px;']{
  display: none;
} */

/* .v-event {
  width: 95% !important;
  position: absolute;
  top: 0px;
  margin-left: 50px;
} */

/* .v-calendar-monthly {
  overflow: hidden;
} */
</style>
