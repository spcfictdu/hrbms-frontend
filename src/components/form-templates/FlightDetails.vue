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
          :key="`group-${group.flightGroup}`"
        >
          <FlightDetailsCardSkeleton v-if="loading" />
          <FlightDetailsCard
            v-else
            @edit="setEditingGroupId"
            @delete="prepareFlightDeletion"
            :flightGroup="group"
            :edit="editingGroupId === group.flightGroup"
            @submit="handleEditFlight"
          />
        </v-col>
        <v-col
          cols="12"
          v-for="temp in tempFlights"
          :key="`temp-${temp.flightGroup}`"
        >
          <FlightDetailsCard
            @edit="setEditingGroupId"
            @delete="prepareFlightDeletion"
            :flightGroup="tempToGroup(temp)"
            :edit="editingGroupId === temp.flightGroup"
            @submit="handleCreateFlight($event, temp.flightGroup)"
          />
        </v-col>
      </v-row>
    </FormSection>

    <ConfirmationDialog
      :opened="dialog"
      :loading="getLoading('dialog')"
      :onClose="
        () => {
          dialog = false;
        }
      "
      :meta="confirmationMeta"
      @onProceed="handleDeleteFlight"
    />
  </div>
</template>

<script>
import FormSection from "@/components/sections/FormSection.vue";
import FlightDetailsCardSkeleton from "@/components/skeleton-loaders/FlightDetailsCardSkeleton.vue";
import FlightDetailsCard from "@/components/cards/FlightDetailsCard.vue";
import ConfirmationDialog from "../dialogs/ConfirmationDialog.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "FlightDetails",
  components: {
    FormSection,
    FlightDetailsCardSkeleton,
    FlightDetailsCard,
    ConfirmationDialog,
  },
  data() {
    return {
      editingGroupId: null,
      tempFlights: [],
      dialog: false,
      flightGroupToBeDeleted: null,
      confirmationMeta: {
        action: "Delete",
        actionType: "flight?",
      },
    };
  },
  methods: {
    ...mapActions("transaction", [
      "createFlight",
      "updateFlight",
      "deleteFlight",
      "fetchFlights",
    ]),
    prepareFlightDeletion(flightGroup) {
      this.dialog = true;
      this.flightGroupToBeDeleted = flightGroup;
    },
    getFlightGroup(flightGroup) {
      return this.groupedFlights.find((g) => g.flightGroup === flightGroup);
    },
    getTempFlightIndex(flightGroup) {
      return this.tempFlights.findIndex((t) => t.flightGroup === flightGroup);
    },
    removeTempFlight(index) {
      this.tempFlights.splice(index, 1);
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
      const adjustedPayload = {
        ...payload,
        flightGroup,
      };
      const transactionReferenceNumber = this.transactionReferenceNumber;
      try {
        await this.createFlight({
          transactionReferenceNumber,
          payload: adjustedPayload,
        });

        const tempIndex = this.getTempFlightIndex(flightGroup);
        if (tempIndex > -1) {
          this.removeTempFlight(tempIndex);
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.editingGroupId = null;
      }
    },
    async handleEditFlight(payload) {
      const group = this.getFlightGroup(payload.flightGroup);
      const transactionReferenceNumber = this.transactionReferenceNumber;
      try {
        const promises = [];

        if (payload.arrivalFlightNumber) {
          const flight = {
            flightId: group.arrival?.id,
            flightNumber: payload.arrivalFlightNumber,
            firstName: payload.firstName,
            lastName: payload.lastName,
            arrivalDate: payload.arrivalDate,
            arrivalTime: payload.arrivalTime,
          };
          if (!flight.flightId) {
            delete flight.flightId;
            delete flight.flightNumber;
            flight.arrivalFlightNumber = payload.arrivalFlightNumber;
            promises.push(this.handleCreateFlight(flight, payload.flightGroup));
          } else {
            promises.push(
              this.updateFlight({
                transactionReferenceNumber,
                payload: flight,
              })
            );
          }
        }

        if (payload.departureFlightNumber) {
          const flight = {
            flightId: group.departure?.id,
            flightNumber: payload.departureFlightNumber,
            firstName: payload.firstName,
            lastName: payload.lastName,
            departureDate: payload.departureDate,
            departureTime: payload.departureTime,
          };
          if (!flight.flightId) {
            delete flight.flightId;
            delete flight.flightNumber;
            flight.departureFlightNumber = payload.departureFlightNumber;
            promises.push(this.handleCreateFlight(flight, payload.flightGroup));
          } else {
            promises.push(
              this.updateFlight({
                transactionReferenceNumber,
                payload: flight,
              })
            );
          }
        }

        if (promises.length > 0) {
          await Promise.all(promises);
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.editingGroupId = null;
      }
    },
    setEditingGroupId(groupId) {
      this.editingGroupId = groupId;
    },
    async handleDeleteFlight(groupId = this.flightGroupToBeDeleted) {
      const tempIndex = this.getTempFlightIndex(groupId);
      const transactionReferenceNumber = this.transactionReferenceNumber;

      if (tempIndex > -1) {
        this.removeTempFlight(tempIndex);
      } else {
        const group = this.getFlightGroup(groupId);
        const promises = [];
        if (group.arrival?.id) {
          promises.push(
            this.deleteFlight({
              transactionReferenceNumber,
              payload: { flightId: group.arrival.id },
            })
          );
        }
        if (group.departure?.id) {
          promises.push(
            this.deleteFlight({
              transactionReferenceNumber,
              payload: { flightId: group.departure.id },
            })
          );
        }
        if (promises.length > 0) {
          try {
            await Promise.all(promises);
          } catch (err) {
            console.error(err);
          }
        }
      }

      this.dialog = false;
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
    ...mapState("transaction", ["flights"]),
    ...mapGetters("transaction", ["getLoading"]),

    loading() {
      return this.getLoading("flights") && !this.flights.length;
    },

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
