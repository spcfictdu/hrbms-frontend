<template>
  <div class="mt-6">
    <dashboard-component
      @input-event="assignButtonQuery"
      @redirect-event="redirectToRoomCategory"
      :rooms="dashboardData"
      :meta="meta"
    />
  </div>
</template>

<script>
import DashboardComponent from "@/components/public/DashboardComponent.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "GuestDashboardView",
  components: { DashboardComponent },
  data: () => ({
    queryParams: {},
    queries: ["capacity", "checkInDate", "checkOutDate", "roomType"],
  }),
  methods: {
    ...mapActions("publicRooms", [
      "fetchPublicRooms",
      "fetchFilteredPublicRoom",
      "triggerLoading",
    ]),
    fetchFilteredRoom: function () {
      this.triggerLoading().then(() => {
        this.fetchFilteredPublicRoom(this.queryParams);
      });
    },
    assignRouteQuery: function () {
      const queries = ["numberOfGuests", "checkInDate", "checkOutDate"];
      const routeQueries = Object.keys(this.routeQuery);
      for (const key in this.routeQuery) {
        if (Object.hasOwnProperty.call(this.routeQuery, key)) {
          const value = this.routeQuery[key];

          queries.forEach((query) => {
            if (routeQueries.includes(query)) {
              if (key === "numberOfGuests") {
                this.$set(this.queryParams, "capacity", value);
              } else {
                this.$set(this.queryParams, key, value);
              }
            } else {
              if (query === "numberOfGuests") {
                this.$delete(this.queryParams, "capacity");
              } else {
                this.$delete(this.queryParams, query);
              }
            }
          });
        }
      }
      this.fetchFilteredRoom();
    },
    assignButtonQuery: function (queryParam) {
      for (const key in queryParam) {
        if (Object.hasOwnProperty.call(queryParam, key)) {
          const value = queryParam[key];
          if (value === "All Rooms") {
            this.$delete(this.queryParams, key);
          } else {
            this.$set(this.queryParams, key, value);
          }
        }
      }
      this.fetchFilteredRoom();
    },
    redirectToRoomCategory: function (referenceNumber) {
      let queryData = {};
      for (const key in this.routeQuery) {
        if (Object.hasOwnProperty.call(this.routeQuery, key)) {
          const value = this.routeQuery[key];
          if (key !== "numberOfGuests") {
            this.$set(queryData, key, value);
          }
        }
      }

      const routeData = {
        name: "Guest Room Category",
        params: {
          referenceNumber: referenceNumber,
        },
        query: queryData,
      };

      this.$router.push(routeData);
    },
  },
  computed: {
    ...mapState("publicRooms", {
      publicRooms: "rooms",
      publicFilteredRooms: "filteredRooms",
      meta: "meta",
    }),
    roomSearchQuery: function () {
      return JSON.stringify(this.$route.query) === "{}";
    },
    routeQuery: function () {
      return this.$route.query;
    },
    dashboardData: function () {
      let data = null;
      if (!this.roomSearchQuery) {
        data = this.publicFilteredRooms;
      } else {
        data = this.publicRooms;
      }

      return {
        isQuery: !this.roomSearchQuery,
        results: data,
      };
    },
  },
  watch: {
    roomSearchQuery: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (!newVal) {
          this.assignRouteQuery(this.routeQuery);
        }
      },
    },
  },
  mounted() {
    this.fetchPublicRooms();
  },
};
</script>

<style scoped></style>
