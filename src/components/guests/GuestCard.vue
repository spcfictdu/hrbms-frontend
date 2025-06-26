<template>
  <v-card
    @click="$emit('onClick', transaction.transactionRefNum)"
    flat
    class="mb-5"
  >
    <v-card-text class="black--text">
      <div class="d-flex align-center justify-space-between">
        <div class="text-uppercase font-weight-bold">Guest Details</div>
        <v-chip
          dark
          small
          :color="statusColors[transaction.status.toLowerCase()]"
          >{{ transaction.status }}</v-chip
        >
      </div>

      <p class="primary--text font-weight-bold text-uppercase">
        {{ transaction.fullName }}
      </p>

      <div>
        <div>Standard</div>
        <div>
          <span class="font-weight-medium">Room {{ transaction.room }}</span> |
          {{ transaction.occupants }} Maximum Occupancy
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
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
};
</script>
