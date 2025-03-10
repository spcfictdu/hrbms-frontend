<template>
  <div>
    <v-card
      flat
      outlined
      class="card-container"
      v-if="!isEmpty"
      @click="transactionEvent(transaction)"
      :ripple="false"
    >
      <div>
        <div class="text-body-1 text-sm-h6 text-uppercase font-weight-bold">
          {{ transaction.roomName }}
        </div>
        <div class="d-flex align-center flex-wrap">
          <v-chip
            color="primary"
            x-small
            class="chip-breakpoint font-weight-medium"
            >{{ formatDate(transaction.checkInDate) }} -
            {{ formatDate(transaction.checkOutDate) }}
          </v-chip>
          <div
            class="mobile-breakpoint text-caption primary--text font-weight-bold"
          >
            {{ formatDate(transaction.checkInDate) }} -
            {{ formatDate(transaction.checkOutDate) }}
          </div>
          <div class="text-caption text-sm-subtitle-2 price-margin">
            <span class="font-weight-bold"
              >PHP {{ transaction.amountReceived
              }}<small class="font-weight-regular">/TOTAL PAYMENT</small></span
            >
          </div>
        </div>
      </div>

      <p class="mt-4 text-body-2">
        {{ transaction.roomDescription }}
      </p>

      <v-divider />

      <section class="mt-4">
        <div class="text-overline font-weight-bold">Amenities:</div>
        <div class="grid-container">
          <div
            class="text-muted text-caption font-weight-regular"
            v-for="(i, index) in transaction.amenities"
            :key="index"
          >
            {{ i.name }}
          </div>
        </div>
      </section>
    </v-card>
    <v-card
      v-else
      flat
      outlined
      class="card-container transparent-bg d-flex justify-center align-center"
    >
      <div>You don’t have any {{ selectedButton.toLowerCase() }}.</div>
    </v-card>
  </div>
</template>

<script>
import { format, parseISO } from "date-fns";
export default {
  name: "TransactionCard",
  props: { transaction: Object, selectedButton: String },
  data: () => ({}),
  methods: {
    formatDate: function (date) {
      return date ? format(parseISO(date), "MMM dd, yyyy").toUpperCase() : null;
    },
    transactionEvent: function (payload) {
      let routeMeta = {
        status: payload.status,
        referenceNumber: payload.referenceNumber,
      };
      this.$emit("transaction-event", routeMeta);
    },
  },
  computed: {
    isEmpty: function () {
      return JSON.stringify(this.transaction) === "{}" ? true : false;
    },
  },
};
</script>

<style scoped>
.transparent-bg {
  background: transparent;
}

.text-muted {
  color: #555555;
}

.card-container {
  padding: 16px 20px;
  border-radius: 10px;
  min-height: 150px;
}

.chip-breakpoint {
  display: flex;
}

.mobile-breakpoint {
  display: none;
}

.price-margin {
  margin-left: 4px;
}

@media (max-width: 360px) {
  .chip-breakpoint {
    display: none;
  }

  .mobile-breakpoint {
    display: flex;
  }

  .price-margin {
    margin-left: 0;
  }
}

.card-container .grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: auto;
}

@media (max-width: 599px) {
  .card-container .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
