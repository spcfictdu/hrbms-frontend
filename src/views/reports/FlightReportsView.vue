<template>
  <Reports
    :buttons="buttons"
    :headers="headers"
    :items="items"
    :statusColors="statusColors"
    @statusselect="selectStatus"
    :selectedStatus="selectedStatus"
    @dateselect="selectDate"
    :loading="isFlightLoading"
    @print="handlePrint"
  />
</template>

<script>
import Reports from "@/components/reports/Reports.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { format, parse } from "date-fns";
import PrintReport from "@/mixins/PrintReport";

export default {
  name: "FlightReportsView",
  components: { Reports },
  mixins: [PrintReport],
  data() {
    return {
      selectedStatus: "",
      currentDate: format(new Date(), "yyyy-MM-dd"),
      headers: [
        { text: "Time", value: "time", width: 100, align: "center" },
        { text: "Guest Name", value: "guestName", align: "center" },
        { text: "Date", value: "date", align: "center" },
        { text: "Flight #", value: "flightNumber", align: "center" },
        { text: "Status", value: "status", align: "center" },
      ],
      statusColors: {
        Arrival: "available",
        Departure: "warning",
      },
    };
  },
  mounted() {
    const dateToUse = this.$route.query.date || this.currentDate;
    this.currentDate = dateToUse;
    this.fetchFlightReports({ date: dateToUse });

    this.selectedStatus = this.$route.query.status || "";
  },
  methods: {
    ...mapActions("reports", ["fetchFlightReports"]),
    ...mapMutations("reports", ["RESET_FLIGHT_REPORTS"]),
    handlePrint(table) {
      const options = {
        reportTitle: "Flights Report",
        headerText: this.selectedStatus || "All Flights",
        user: this.getCurrentUser,
      };
      this.printReport(table, options);
    },
    mapWithStatus(items, status) {
      return items.map((item) => ({ ...item, status }));
    },
    selectStatus(status) {
      if (this.selectedStatus === status) {
        this.selectedStatus = "";
        return;
      }
      this.selectedStatus = status;
    },
    async selectDate(date) {
      if (date === this.currentDate) return;
      try {
        await this.fetchFlightReports({ date });
        this.currentDate = date;
        const newQuery = { ...this.$route.query, date };
        await this.$router.replace({ query: newQuery });
      } catch (err) {
        if (err.name !== "NavigationDuplicated") {
          throw err;
        }
      }
    },
  },
  watch: {
    "$route.query.date": {
      handler(newDate) {
        const dateToUse = newDate || format(new Date(), "yyyy-MM-dd");
        if (dateToUse !== this.currentDate) {
          this.fetchFlightReports({ date: dateToUse }).then(() => {
            this.currentDate = dateToUse;
          });
        }
      },
    },
    "$route.query.status": {
      handler(newVal) {
        this.selectedStatus = newVal || "";
      },
      immediate: true,
    },
    selectedStatus: {
      handler: async function (newVal) {
        const currentStatus = this.$route.query.status;
        const targetStatus = newVal || undefined;
        if (currentStatus !== targetStatus) {
          const newQuery = { ...this.$route.query, status: targetStatus };
          try {
            await this.$router.replace({ query: newQuery });
          } catch (err) {
            if (err.name !== "NavigationDuplicated") {
              throw err;
            }
          }
        }
      },
      immediate: false,
    },
  },
  computed: {
    ...mapGetters("reports", ["arrivals", "departures", "isFlightLoading"]),
    ...mapGetters("authentication", ["getCurrentUser"]),
    items() {
      return this.flights.map((r) => {
        let time = "";
        const timeField = r.arrivalTime || r.departureTime;
        if (timeField) {
          const parsedTime = parse(timeField, "H:mm:ss", new Date());
          if (!isNaN(parsedTime.getTime())) {
            time = format(parsedTime, "h:mm a");
          }
        }

        let date = "";
        const dateField = r.arrivalDate || r.departureDate;
        if (dateField) {
          const parsedDate = parse(dateField, "yyyy-MM-dd", new Date());
          if (!isNaN(parsedDate.getTime())) {
            date = format(parsedDate, "MMMM d, yyyy");
          }
        }

        return {
          time,
          guestName: r.guestName || "",
          date,
          flightNumber: r.flightNumber,
          status: r.status,
        };
      });
    },
    flights() {
      if (!this.selectedStatus) {
        return [
          ...this.mapWithStatus(this.arrivals, "Arrival"),
          ...this.mapWithStatus(this.departures, "Departure"),
        ];
      }

      switch (this.selectedStatus) {
        case "Arrivals":
          return this.mapWithStatus(this.arrivals, "Arrival");
        case "Departures":
          return this.mapWithStatus(this.departures, "Departure");
        default:
          return [];
      }
    },
    buttons() {
      return [
        {
          count: this.arrivals.length,
          status: "Arrivals",
        },
        {
          count: this.departures.length,
          status: "Departures",
        },
      ];
    },
  },
  beforeRouteLeave(_to, _from, next) {
    this.RESET_FLIGHT_REPORTS();
    next();
  },
};
</script>
