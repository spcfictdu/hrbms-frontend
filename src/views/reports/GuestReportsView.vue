<template>
  <Reports
    :buttons="buttons"
    :headers="headers"
    :items="items"
    :menuItems="menuItems"
    :statusColors="statusColors"
    @statusselect="selectStatus"
    :selectedStatus="selectedStatus"
    @dateselect="selectDate"
  />
</template>

<script>
import Reports from "@/components/reports/Reports.vue";
import { mapActions, mapGetters } from "vuex";
import { format, parse } from "date-fns";

export default {
  name: "GuestReportsView",
  components: { Reports },
  data() {
    return {
      selectedStatus: "",
      headers: [
        { text: "Time", value: "time", width: 100, align: "center" },
        { text: "Guest Name", value: "guestName", align: "center" },
        { text: "Date", value: "date", align: "center" },
        { text: "Room", value: "room", align: "center" },
        { text: "Floor", value: "floor", align: "center" },
        { text: "Status", value: "status", align: "center" },
      ],
      statusColors: {
        "Checked In": "checkedin",
        "Checked Out": "housekeeping",
        "In-house": "primary",
      },
    };
  },
  methods: {
    ...mapActions("reports", ["fetchGuestReports"]),
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
      if (date === this.reportDate) return;
      try {
        await this.fetchGuestReports({ date });
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
        if (dateToUse !== this.reportDate) {
          this.fetchGuestReports({ date: dateToUse });
        }
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
    ...mapGetters("reports", [
      "allCheckIns",
      "allCheckOuts",
      "inHouse",
      "reportDate",
    ]),
    items() {
      const reportDateStr = this.reportDate || format(new Date(), "yyyy-MM-dd");
      const date = parse(reportDateStr, "yyyy-MM-dd", new Date());
      const formattedDate = format(date, "MMMM d, yyyy");
      return this.reports.map((r) => {
        let time = "";
        const timeField = r.checkOutTime || r.checkInTime;
        if (timeField) {
          const parsedTime = parse(timeField, "H:mm:ss", new Date());
          if (!isNaN(parsedTime.getTime())) {
            time = format(parsedTime, "h:mm a");
          }
        }
        return {
          time,
          guestName: r.guestName,
          date: formattedDate,
          room: `ROOM ${r.roomNumber}`,
          floor: "Floor 7",
          status: r.status,
        };
      });
    },
    reports() {
      const checkIns = (status = "Checked In") => [
        ...this.mapWithStatus(this.allCheckIns.expected, status),
        ...this.mapWithStatus(this.allCheckIns.actual, status),
      ];
      const checkOuts = (status = "Checked Out") => [
        ...this.mapWithStatus(this.allCheckOuts.expected, status),
        ...this.mapWithStatus(this.allCheckOuts.actual, status),
      ];
      const inHouse = (status = "In-house") =>
        this.mapWithStatus(this.inHouse, status);
      if (!this.selectedStatus) {
        return [...checkIns(), ...checkOuts(), ...inHouse()];
      }

      switch (this.selectedStatus) {
        case "Check Ins":
          return checkIns();
        case "Check Outs":
          return checkOuts();
        case "In-house":
          return inHouse();
        default:
          return [];
      }
    },
    buttons() {
      return [
        {
          count:
            this.allCheckIns.expected.length + this.allCheckIns.actual.length,
          status: "Check Ins",
        },
        {
          count:
            this.allCheckOuts.expected.length + this.allCheckOuts.actual.length,
          status: "Check Outs",
        },
        {
          count: this.inHouse.length,
          status: "In-house",
        },
      ];
    },
  },
  created() {
    this.selectedStatus = this.$route.query.status || "";
  },
};
</script>
