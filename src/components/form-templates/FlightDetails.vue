<template>
  <div>
    <FormSection title="Flight Details">
      <template #actions>
        <v-btn @click="handleAddFlight" depressed color="primary" small>
          Add Flight
        </v-btn>
      </template>

      <v-row>
        <v-col
          cols="12"
          v-for="group in groupedFlights"
          :key="group.flightGroup"
        >
          <FlightDetailsCard
            @edit="setEditingGroupId"
            @delete="handleDeleteFlight"
            :flightGroup="group"
            :edit="editingGroupId === group.flightGroup"
            @submit="handleEditFlight"
          />
        </v-col>
        <v-col cols="12" v-for="temp in tempFlights" :key="temp.flightGroup">
          <FlightDetailsCard
            @edit="setEditingGroupId"
            @delete="handleDeleteFlight"
            :flightGroup="tempToGroup(temp)"
            :edit="editingGroupId === temp.flightGroup"
            @submit="handleCreateFlight($event, temp.flightGroup)"
          />
        </v-col>
      </v-row>
    </FormSection>

    <!-- <ConfirmationDialog :opened="dialog.confirmation" /> -->
  </div>
</template>

<script>
import FormSection from "@/components/sections/FormSection.vue";
import FlightDetailsCard from "@/components/cards/FlightDetailsCard.vue";
import ConfirmationDialog from "../dialogs/ConfirmationDialog.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "FlightDetails",
  components: { FormSection, FlightDetailsCard, ConfirmationDialog },
  data() {
    return {
      editingGroupId: null,
      tempFlights: [],
    };
  },
  methods: {
    ...mapActions("transaction", [
      "createFlight",
      "updateFlight",
      "deleteFlight",
      "fetchFlights",
    ]),
    getTempFlightIndex(flightGroup) {
      return this.tempFlights.findIndex((t) => t.flightGroup === flightGroup);
    },
    removeTempFlight(index) {
      return this.tempFlights.splice(index, 1);
    },
    handleAddFlight() {
      const maxGroup = Math.max(
        1,
        ...this.flights.map((f) => f.flight_group || 1)
      );
      const newGroupId = maxGroup + 1;
      const newFlight = {
        flightGroup: newGroupId,
        guestName: "",
        arrivalFlightNumber: "",
        arrivalDate: "",
        arrivalTime: "",
        departureFlightNumber: "",
        departureDate: "",
        departureTime: "",
      };
      this.tempFlights.push(newFlight);
      this.editingGroupId = newGroupId;
    },
    async handleCreateFlight(payload, flightGroup) {
      try {
        await this.createFlight({
          transactionReferenceNumber: this.transactionReferenceNumber,
          payload,
        });

        const tempIndex = this.getTempFlightIndex(flightGroup);
        this.removeTempFlight(tempIndex);

        this.fetchFlights(this.transactionReferenceNumber);
      } catch (err) {
        console.error(err);
      } finally {
        this.editingGroupId = null;
      }
    },
    async handleEditFlight(payload) {
      try {
        await this.createFlight({
          transactionReferenceNumber: this.transactionReferenceNumber,
          payload,
        });

        this.fetchFlights(this.transactionReferenceNumber);
      } catch (err) {
        console.error(err);
      } finally {
        this.editingGroupId = null;
      }
    },
    setEditingGroupId(groupId) {
      this.editingGroupId = groupId;
    },
    async handleDeleteFlight(groupId) {
      const tempIndex = this.getTempFlightIndex(groupId);
      if (tempIndex > -1) {
        this.removeTempFlight(tempIndex);
      } else {
        const group = this.groupedFlights.find(
          (g) => g.flightGroup === groupId
        );
        const promises = [
          ...(group?.arrival
            ? [this.deleteFlight({ flightId: group.arrival.id })]
            : []),
          ...(group?.departure
            ? [
                this.deleteFlight({
                  flightId: group.departure.id,
                }),
              ]
            : []),
        ];
        if (promises.length > 0) {
          try {
            await Promise.all(promises);

            this.fetchFlights(this.$route.params.referenceNumber);
          } catch (err) {
            console.error(err);
          }
        }
      }

      if (this.editingGroupId === groupId) {
        this.editingGroupId = null;
      }
    },
    tempToGroup(temp) {
      return {
        flightGroup: temp.flightGroup,
        arrival:
          temp.arrivalDate && temp.arrivalFlightNumber
            ? {
                guestName: temp.guestName,
                flightNumber: temp.arrivalFlightNumber,
                arrivalDate: temp.arrivalDate,
                arrivalTime: temp.arrivalTime,
              }
            : null,
        departure:
          temp.departureDate && temp.departureFlightNumber
            ? {
                guestName: temp.guestName,
                flightNumber: temp.departureFlightNumber,
                departureDate: temp.departureDate,
                departureTime: temp.departureTime,
              }
            : null,
      };
    },
  },
  computed: {
    ...mapState("transaction", ["flights", "dialog"]),
    transactionReferenceNumber() {
      return this.$route.params.referenceNumber;
    },
    groupedFlights() {
      const groups = this.flights.reduce((acc, flight) => {
        const groupId = flight.flight_group;
        if (!acc[groupId]) {
          acc[groupId] = {
            flightGroup: groupId,
            arrival: null,
            departure: null,
          };
        }
        if (flight.arrival_date && !flight.departure_date) {
          acc[groupId].arrival = flight;
        } else if (flight.departure_date && !flight.arrival_date) {
          acc[groupId].departure = flight;
        }
        return acc;
      }, {});
      return Object.values(groups).filter((g) => g.arrival || g.departure);
    },
  },
};
</script>
