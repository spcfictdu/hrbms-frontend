<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-row no-gutters align="center">
          <v-col cols="auto">
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
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
        </v-row>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
          interval-count="0"
        >
          <template v-slot:interval> </template>
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
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
      deluxe: [
        "Deluxe 1",
        "Deluxe 2",
        "Deluxe 3",
        "Deluxe 4",
        "Deluxe 5",
        "Deluxe 6",
        "Deluxe 7",
        "Deluxe 8",
      ],
      regular: [
        "Regular 1",
        "Regular 2",
        "Regular 3",
        "Regular 4",
        "Regular 5",
        "Regular 6",
        "Regular 7",
        "Regular 8",
      ],
      suite: [
        "Suite 1",
        "Suite 2",
        "Suite 3",
        "Suite 4",
        "Suite 5",
        "Suite 6",
        "Suite 7",
        "Suite 8",
      ],
    },
    statuses: [
      "Confirmed",
      "Checked-in",
      "Checked-out",
      "Unallocated",
      "Ready for Occupancy",
    ],
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      let color = null;
      if (event.status === "Confirmed") {
        color = "red";
      } else if (event.status === "Checked-in") {
        color = "primary";
      } else if (event.status === "Checked-out") {
        color = "grey";
      } else if (event.status === "Unallocated") {
        color = "blue lighten-3";
      } else if (event.status === "Ready for Occupancy") {
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
    updateRange({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.rooms[this.rnd(0, this.rooms.length - 1)],
          start: first,
          end: second,
          status: this.statuses[this.rnd(0, this.statuses.length - 1)],
        });
      }

      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
  watch: {
    selectedRoomType: {
      immediate: true,
      handler(newVal) {
        if (newVal === "deluxe") {
          this.rooms = this.roomNames.deluxe;
        } else if (newVal === "regular") {
          this.rooms = this.roomNames.regular;
        } else if (newVal === "suite") {
          this.rooms = this.roomNames.suite;
        }
        console.log(this.$refs.calendar.isEventForCategory().lastEnd.date)
        // this.updateRange(this.$refs.calendar.)
      },
    },
  },
};
</script>

<style scoped></style>
