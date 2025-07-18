<template>
  <v-card
    @click="
      $emit('onClick', transaction.transactionRefNum, transaction.fullName)
    "
    flat
    class="mb-5"
  >
    <v-card-text class="black--text">
      <div class="d-flex align-center justify-space-between">
        <div class="text-uppercase font-weight-bold">Guest Details</div>

        <v-menu offset-x left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
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
      </div>

      <p class="primary--text font-weight-bold text-uppercase">
        {{ transaction.fullName }}
      </p>

      <div class="d-flex align-end justify-space-between">
        <div>
          <div>{{ transaction.room.name }}</div>
          <div>
            <span class="font-weight-medium"
              >Room {{ transaction.room.number }}</span
            >
            | {{ transaction.room.capacity }} Maximum Occupancy
          </div>
        </div>

        <v-chip
          class="font-weight-bold"
          dark
          small
          :color="statusColors[transaction.status.toLowerCase()]"
          >{{ transaction.status }}</v-chip
        >
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "GuestCard",
  props: { transaction: Object },
  data: () => ({
    statusColors: {
      "checked-in": "checkedin",
      "checked-out": "checkedout",
      reserved: "reserved",
      confirmed: "confirmed",
    },
  }),

  methods: {
    ...mapActions("transaction", ["fetchTransaction"]),
    ...mapActions("guest", ["fetchGuest"]),

    async setFormDetails() {
      await this.fetchTransaction(this.transaction.transactionRefNum);
      await this.fetchGuest({ id: this.transaction.guestId });

      const {
        firstName,
        middleName,
        lastName,
        province,
        city,
        phone: phoneNumber,
        email,
      } = this.guest;

      const formDetails = {
        firstName,
        middleName,
        lastName,
        address: {
          city,
          province,
        },
        contact: {
          email,
          phoneNumber,
        },
        status: this.transaction.status,
        checkIn: {
          date: this.transaction.checkInDate,
          time: this.fetchedTransaction.transaction.checkInTime.slice(0, -3),
        },
        checkOut: {
          date: this.transaction.checkOutDate,
          time: this.fetchedTransaction.transaction.checkOutTime.slice(0, -3),
        },
        guests: this.fetchedTransaction.transaction.extraPerson,
        addons: this.fetchedTransaction.priceSummary.fullAddons.map(
          ({ name, quantity }) => ({ name, quantity: String(quantity) })
        ),
        transactionRefNum: this.transaction.transactionRefNum,
      };

      sessionStorage.setItem("formDetails", JSON.stringify(formDetails));
    },

    async redirectToForm(action) {
      await this.setFormDetails();

      this.$router.push({
        name: "Booking",
        query: {
          room: this.transaction.room.name,
          referenceNumber: this.transaction.room.referenceNumber,
          roomNumber: this.transaction.room.number,
          action,
        },
      });
    },
  },

  computed: {
    ...mapState("guest", ["guest"]),
    ...mapState("transaction", { fetchedTransaction: "transaction" }),

    menuOptions() {
      const options = [
        {
          title: "View",
          action: () => {
            this.redirectToForm("View");
          },
        },
      ];

      if (this.transaction.status === "RESERVED") {
        options.push(
          ...[
            {
              title: "Edit",
              action: () => {
                this.redirectToForm("Edit");
              },
            },
            {
              title: "Cancel Reservation",
              class: "red--text",
              action: () =>
                this.$emit("onCancelReservation", {
                  status: this.transaction.status,
                  transactionRefNum: this.transaction.transactionRefNum,
                }),
            },
          ]
        );
      }

      return options;
    },
  },
};
</script>

<style scoped>
.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
