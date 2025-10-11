<template>
  <v-card flat color="lightBg" class="pl-1 pr-3">
    <div
      @click="showDetails = !showDetails"
      class="cursor-pointer d-flex flex-column flex-sm-row justify-space-between"
    >
      <v-card-title class="d-flex flex-column align-start">
        <div class="primary--text text-uppercase font-weight-bold">
          {{ guestName }}
        </div>
        <div class="subtitle-2 longText--text font-weight-regular">
          <span class="font-weight-bold">
            {{ flightLabel && `${flightLabel}:` }}
          </span>
          {{ flightDateTimeInfo || "No flight information available." }}
        </div>
      </v-card-title>

      <v-card-actions>
        <v-chip
          block
          class="text-uppercase px-3 font-weight-bold"
          small
          depressed
          rounded
          color="primary"
        >
          {{ flightStatus || "No Data" }}
        </v-chip>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="ml-1" icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense class="py-0">
            <v-list-item
              class="menu-border"
              :class="item.class"
              v-for="(item, i) in menuOptions"
              :key="i"
              @click="item.action"
            >
              <v-list-item-title class="text-body-2 font-weight-regular">{{
                item.title
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-actions>
    </div>

    <v-expand-transition>
      <div v-show="showDetails">
        <v-divider></v-divider>

        <v-card-text>
          <v-row v-if="!edit">
            <v-col
              v-for="(section, index) in sections"
              :key="index"
              :cols="section.cols || 12"
            >
              <div class="text-overline font-weight-bold">
                {{ section.title }}
              </div>
              <v-row>
                <v-col
                  v-for="(field, fIndex) in section.fields"
                  :key="fIndex"
                  :cols="field.cols || 12"
                >
                  <div class="longText--text text-uppercase text-caption">
                    {{ field.label }}
                  </div>
                  <div class="font-weight-bold">{{ field.value }}</div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <FlightDetailsForm
            v-else
            :flightDetails="combinedFlightDetails"
            @submit="$emit('submit', $event)"
          />
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import FlightDetailsForm from "@/components/hotel-rooms/forms/FlightDetailsForm.vue";
import { parse, compareAsc, format } from "date-fns";

export default {
  name: "FlightDetailsCard",
  components: { FlightDetailsForm },
  props: {
    flightGroup: Object,
    edit: Boolean,
  },
  data() {
    return {
      showDetails: true,
      menuOptions: [
        {
          title: "Edit",
          action: () => {
            this.showDetails = true;
            this.$emit("edit", this.groupId);
          },
        },
        {
          title: "Delete",
          class: "red--text",
          action: () => {
            this.$emit("delete", this.groupId);
          },
        },
      ],
    };
  },
  computed: {
    groupId() {
      return this.flightGroup.flightGroup;
    },
    combinedFlightDetails() {
      const arrival = this.flightGroup?.arrival || {};
      const departure = this.flightGroup?.departure || {};
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        arrivalFlightNumber: arrival.flight_number || "",
        arrivalDate: arrival.arrival_date || "",
        arrivalTime: arrival.arrival_time || "",
        departureFlightNumber: departure.flight_number || "",
        departureDate: departure.departure_date || "",
        departureTime: departure.departure_time || "",
        flightGroup: this.flightGroup?.flightGroup || "",
      };
    },
    sections() {
      return [
        {
          title: "Guest Name",
          fields: [
            { label: "First Name", value: this.firstName || "N/A", cols: 6 },
            { label: "Last Name", value: this.lastName || "N/A", cols: 6 },
          ],
        },
        {
          title: "Arrival",
          cols: 6,
          fields: [
            { label: "Flight #", value: this.arrivalFlightNumber },
            { label: "Date of Arrival", value: this.formattedArrivalDate },
            { label: "Flight ETA", value: this.formattedArrivalTime },
          ],
        },
        {
          title: "Departure",
          cols: 6,
          fields: [
            { label: "Flight #", value: this.departureFlightNumber },
            { label: "Date of Departure", value: this.formattedDepartureDate },
            { label: "Flight ETD", value: this.formattedDepartureTime },
          ],
        },
      ];
    },
    guestName() {
      return (
        this.flightGroup?.arrival?.full_name ||
        this.flightGroup?.departure?.full_name ||
        "Unnamed Guest"
      );
    },
    firstName() {
      return (
        this.flightGroup?.arrival?.first_name ||
        this.flightGroup?.departure?.first_name ||
        ""
      );
    },
    lastName() {
      return (
        this.flightGroup?.arrival?.last_name ||
        this.flightGroup?.departure?.last_name ||
        ""
      );
    },
    arrivalFlightNumber() {
      return this.flightGroup?.arrival?.flight_number || "N/A";
    },
    departureFlightNumber() {
      return this.flightGroup?.departure?.flight_number || "N/A";
    },
    flightStatus() {
      const arrival = this.flightGroup?.arrival;
      const departure = this.flightGroup?.departure;
      if (!arrival && !departure) return null;

      const now = new Date();
      let eta, etd;

      if (arrival) {
        const etaString = `${arrival.arrival_date} ${arrival.arrival_time}`;
        eta = parse(etaString, "yyyy-MM-dd HH:mm:ss", new Date());
      }

      if (departure) {
        const etdString = `${departure.departure_date} ${departure.departure_time}`;
        etd = parse(etdString, "yyyy-MM-dd HH:mm:ss", new Date());
      }

      if (eta && compareAsc(now, eta) < 0) {
        return "ARRIVING";
      } else if (etd && compareAsc(now, etd) < 0) {
        return arrival ? "ARRIVED" : "DEPARTING";
      } else {
        return "DEPARTED";
      }
    },
    flightLabel() {
      if (!this.flightGroup || !this.flightStatus) return null;
      return this.flightStatus === "ARRIVING" ? "ETA" : "ETD";
    },
    flightDateTimeInfo() {
      if (
        (!this.flightGroup?.arrival?.flight_number &&
          !this.flightGroup?.departure?.flight_number) ||
        !this.flightStatus
      )
        return null;

      const status = this.flightStatus;
      let relevantDate;

      if (status === "ARRIVING") {
        if (!this.flightGroup.arrival) return null;
        const etaString = `${this.flightGroup.arrival.arrival_date} ${this.flightGroup.arrival.arrival_time}`;
        relevantDate = parse(etaString, "yyyy-MM-dd HH:mm:ss", new Date());
      } else {
        if (!this.flightGroup.departure) return null;
        const etdString = `${this.flightGroup.departure.departure_date} ${this.flightGroup.departure.departure_time}`;
        relevantDate = parse(etdString, "yyyy-MM-dd HH:mm:ss", new Date());
      }

      if (!relevantDate || isNaN(relevantDate.getTime())) return null;

      const formattedDate = format(relevantDate, "MMMM d, yyyy");
      const formattedTime = format(relevantDate, "h:mm a");
      return `${formattedDate} (${formattedTime})`;
    },
    formattedArrivalDate() {
      if (!this.flightGroup?.arrival?.arrival_date) return "N/A";
      return format(
        new Date(this.flightGroup.arrival.arrival_date),
        "MM/dd/yyyy"
      );
    },
    formattedArrivalTime() {
      if (!this.flightGroup?.arrival?.arrival_time) return "N/A";
      const timeDate = parse(
        this.flightGroup.arrival.arrival_time,
        "HH:mm:ss",
        new Date()
      );
      return format(timeDate, "hh:mm a");
    },
    formattedDepartureDate() {
      if (!this.flightGroup?.departure?.departure_date) return "N/A";
      return format(
        new Date(this.flightGroup.departure.departure_date),
        "MM/dd/yyyy"
      );
    },
    formattedDepartureTime() {
      if (!this.flightGroup?.departure?.departure_time) return "N/A";
      const timeDate = parse(
        this.flightGroup.departure.departure_time,
        "HH:mm:ss",
        new Date()
      );
      return format(timeDate, "hh:mm a");
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.text-overline {
  font-size: 14px !important;
}
</style>
