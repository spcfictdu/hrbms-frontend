<template>
  <div>
    <p class="d-block d-sm-none text-overline font-weight-bold">
      Reservation Form
    </p>
    <v-card flat class="pa-6">
      <v-form lazy-validation ref="form">
        <div class="pb-4">
          <label-slot>
            <template v-slot:label> Check-in Date </template>
          </label-slot>
          <v-menu
            :close-on-content-click="false"
            offset-y
            transition="scale-transition"
            v-model="menu"
            min-width="auto"
            max-width="290"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-on="on"
                v-bind="attrs"
                outlined
                dense
                readonly
                hide-details="auto"
                :value="payload.checkInDate"
                :rules="rules.checkInDate"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="payload.checkInDate"
              :min="minDate"
            ></v-date-picker>
          </v-menu>
        </div>

        <div class="pb-4">
          <label-slot>
            <template v-slot:label> Check-out Date </template>
          </label-slot>
          <v-menu
            :close-on-content-click="false"
            offset-y
            transition="scale-transition"
            v-model="menu_2"
            min-width="auto"
            max-width="290"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-on="on"
                v-bind="attrs"
                outlined
                dense
                readonly
                hide-details="auto"
                :value="payload.checkOutDate"
                :rules="rules.checkOutDate"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="payload.checkOutDate"
              :min="addPlusDay"
            ></v-date-picker>
          </v-menu>
        </div>

        <div class="pb-4">
          <label-slot>
            <template v-slot:label> {{ enumData.label }} </template>
          </label-slot>
          <v-autocomplete
            :items="enumData.enums"
            item-text="roomNumber"
            hide-details="auto"
            dense
            outlined
            v-model="payload.roomNumber"
            :rules="rules.roomNumber"
          ></v-autocomplete>
        </div>

        <v-divider class="mt-4" />
        <p class="mt-1 mb-2 text-caption font-weight-black font-italic">
          Reservation has no charge
        </p>

        <div class="my-3 text-subtitle-2 font-weight-regular">
          <div class="d-flex justify-space-between align-center">
            <div>Room Total:</div>
            <div>₱ {{ roomTotalBill.roomTotal }}</div>
          </div>

          <div class="d-flex justify-space-between align-center">
            <div>Duration:</div>
            <div>{{ roomTotalBill.duration }} {{ durationWord }}</div>
          </div>

          <div
            class="d-flex justify-space-between align-center primary--text font-weight-bold"
          >
            <div>Total:</div>
            <div>₱ {{ roomTotalBill.roomTotalWithExtraPerson }}</div>
          </div>
        </div>

        <v-card-actions class="px-0 pb-0 pt-4">
          <v-btn block color="primary" @click="requestReservation"
            >Make Reservation</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import LabelSlot from "@/components/slots/LabelSlot.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "RoomReservationForm",
  components: { LabelSlot },
  props: {
    roomCategory: String,
  },
  data: () => ({
    payload: {
      checkInDate: null,
      checkOutDate: null,
      roomNumber: null,
    },
    menu: false,
    menu_2: false,
    minDate: new Date().toISOString().slice(0, 10),
  }),
  methods: {
    ...mapActions("roomEnum", ["fetchRoom"]),
    ...mapActions("roomNumberEnum", ["fetchRoomNumbers"]),
    ...mapActions("availableRoomNumbersEnum", ["fetchAvailableRoomNumbers"]),
    requestReservation: function () {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        let payload = {
          room: this.roomCategory,
          referenceNumber: this.room[0].referenceNumber,
          roomNumber: this.payload.roomNumber,
          checkInDate: this.payload.checkInDate,
          checkOutDate: this.payload.checkOutDate,
        };

        this.$emit("reservation-event", payload);
      }
    },
    requestQuery: function () {
      let query = {
        roomType: this.roomCategory,
      };
      if (
        this.payload.checkInDate &&
        this.payload.checkOutDate &&
        this.payload.roomNumber
      ) {
        query.dateRange = [this.payload.checkInDate, this.payload.checkOutDate];
        query.roomNumber = this.payload.roomNumber;
        this.fetchRoom(query);
      } else {
        delete query.dateRange;
        delete query.roomNumber;
      }
    },
    requestRoomNumbers: function () {
      const query = {
        roomType: this.roomCategory.toUpperCase(),
      };
      this.fetchRoomNumbers(query);
    },
    requestAvailableRoomNumbers: function () {
      const query = {
        roomType: this.roomCategory.toUpperCase(),
      };

      if (this.payload.checkInDate && this.payload.checkOutDate) {
        query.checkInDate = this.payload.checkInDate;
        query.checkOutDate = this.payload.checkOutDate;
        this.fetchAvailableRoomNumbers(query);
      }
    },
  },
  computed: {
    ...mapState("roomEnum", {
      room: "room",
    }),
    ...mapState("roomNumberEnum", {
      roomNumberEnum: "roomNumberEnum",
    }),
    ...mapState("availableRoomNumbersEnum", {
      availableRoomNumbersEnum: "availableRoomNumbersEnum",
    }),
    enumData: function () {
      let data = {
        label: "",
        enums: null,
      };
      if (this.role === "GUEST") {
        data.label = "Available Room Numbers";
        data.enums = this.availableRoomNumbersEnum;
      } else if (this.role === "ADMIN") {
        data.label = "Room Number";
        data.enums = this.roomNumberEnum;
      }
      return data;
    },
    rules: function () {
      let errors = {};
      errors.checkInDate = [(v) => !!v || "Check-in Date is required"];
      errors.checkOutDate = [(v) => !!v || "Check-out Date is required"];
      errors.roomNumber = [(v) => !!v || "Room number is required"];
      return errors;
    },
    addPlusDay: function () {
      const startDate = new Date(this.payload.checkInDate);
      startDate.setDate(startDate.getDate() + 1);
      return startDate.toISOString().slice(0, 10);
    },
    roomTotalBill: function () {
      const room = this.room ? this.room[0] : null;
      const payload = !!(
        this.payload.checkInDate &&
        this.payload.checkOutDate &&
        this.payload.roomNumber
      );

      const roomTotal = payload && room ? room.roomTotal : 0;
      const duration = payload && room ? room.duration : 0;
      const roomTotalWithExtraPerson =
        payload && room ? room.roomTotalWithExtraPerson : 0;
      return {
        roomTotal: roomTotal,
        duration: duration,
        roomTotalWithExtraPerson: roomTotalWithExtraPerson,
      };
    },
    durationWord: function () {
      return this.roomTotalBill.duration <= 1 ? "day" : "days";
    },
    role: function () {
      return this.$auth.user().role;
    }
  },
  watch: {
    payload: {
      deep: true,
      handler: function (newVal) {
        if (newVal) {
          this.requestQuery();
        }

        // For Guest Only
        if (this.role === "GUEST") {
          this.requestAvailableRoomNumbers();
        }
      },
    },
    role: {
      deep: true, 
      handler: function (newVal) {
        // For Front Desk Only
        if (newVal.isFrontDesk) {
          this.requestRoomNumbers();
        }
      }
    }
  },
};
</script>

<style scoped></style>
