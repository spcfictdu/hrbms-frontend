<template>
  <Reports
    :buttons="buttons"
    :headers="headers"
    :items="items"
    :statusColors="statusColors"
    @statusselect="selectStatus"
    :selectedStatus="selectedStatus"
    @dateselect="selectDate"
    :loading="isGuestLoading"
  >
    <div v-if="selectedStatus !== 'In-house'" class="mt-4">
      <v-btn
        v-for="tab in tabs"
        :key="tab.text"
        rounded
        depressed
        :color="activeTab === tab.text ? 'primary' : 'lightBg'"
        :class="{ 'inactive-tab': activeTab !== tab.text }"
        class="font-weight-bold px-6 mr-2"
        @click="activeTab = tab.text"
      >
        {{ tab.text }}
      </v-btn>
    </div>
  </Reports>
</template>

<script>
import Reports from "@/components/reports/Reports.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { format, parse } from "date-fns";

export default {
  name: "GuestReportsView",
  components: { Reports },
  data() {
    return {
      selectedStatus: "",
      activeTab: "",
      headers: [
        { text: "Time", value: "time", width: 100, align: "center" },
        { text: "Guest Name", value: "guestName", align: "center" },
        { text: "Date", value: "date", align: "center" },
        { text: "Room", value: "room", align: "center" },
        { text: "Floor", value: "floor", align: "center" },
        { text: "Status", value: "status", align: "center" },
      ],
      tabs: [{ text: "Expected" }, { text: "Actual" }],
      statusColors: {
        "Checked In": "checkedin",
        "Checked Out": "housekeeping",
        "In-house": "primary",
        "To Check-In": "#009688",
        "To Check-Out": "#9C27B0",
      },
    };
  },
  methods: {
    ...mapActions("reports", ["fetchGuestReports"]),
    ...mapMutations("reports", ["SET_GUEST_REPORTS"]),
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
    "$route.query": {
      handler(newQuery) {
        this.selectedStatus = newQuery.status || "";
        this.activeTab = newQuery.tab || "";
        const dateToUse = newQuery.date || format(new Date(), "yyyy-MM-dd");
        if (dateToUse !== this.reportDate) {
          this.fetchGuestReports({ date: dateToUse });
        }
        if (this.selectedStatus === "In-house") {
          this.activeTab = "";
        } else if (!newQuery.tab) {
          this.activeTab = "Expected";
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
    activeTab: {
      handler: async function (newVal) {
        const currentTab = this.$route.query.tab;
        const targetTab = newVal || undefined;
        if (currentTab !== targetTab) {
          const newQuery = { ...this.$route.query, tab: targetTab };
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
      "isGuestLoading",
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
      const getGuestData = (expected, actual, tab, baseStatus) => {
        let data;
        let statusLabel;

        if (tab === "Expected") {
          data = expected;
          statusLabel =
            baseStatus === "Checked In" ? "To Check-In" : "To Check-Out";
        } else if (tab === "Actual") {
          data = actual;
          statusLabel =
            baseStatus === "Checked In" ? "Checked In" : "Checked Out";
        } else {
          // When no tab is selected, combine both
          data = [...expected, ...actual];
          statusLabel = baseStatus;
        }

        return this.mapWithStatus(data, statusLabel);
      };

      const checkIns = () =>
        getGuestData(
          this.allCheckIns.expected,
          this.allCheckIns.actual,
          this.activeTab,
          "Checked In"
        );

      const checkOuts = () =>
        getGuestData(
          this.allCheckOuts.expected,
          this.allCheckOuts.actual,
          this.activeTab,
          "Checked Out"
        );

      const inHouseGuests = () => this.mapWithStatus(this.inHouse, "In-house");

      if (!this.selectedStatus) {
        return [...checkIns(), ...checkOuts(), ...inHouseGuests()];
      }

      switch (this.selectedStatus) {
        case "Check Ins":
          return checkIns();
        case "Check Outs":
          return checkOuts();
        case "In-house":
          return inHouseGuests();
        default:
          return [];
      }
    },

    buttons() {
      const getCount = (expected, actual) => {
        if (this.activeTab === "Expected") {
          return expected.length;
        }
        if (this.activeTab === "Actual") {
          return actual.length;
        }
        return expected.length + actual.length;
      };
      return [
        {
          count: getCount(this.allCheckIns.expected, this.allCheckIns.actual),
          status: "Check Ins",
        },
        {
          count: getCount(this.allCheckOuts.expected, this.allCheckOuts.actual),
          status: "Check Outs",
        },
        {
          count: this.inHouse.length,
          status: "In-house",
        },
      ];
    },
  },
  beforeRouteLeave(_to, _from, next) {
    this.SET_GUEST_REPORTS(null);
    next();
  },
};
</script>
