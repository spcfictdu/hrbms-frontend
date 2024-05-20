<template>
  <v-card class="pa-8 text-subtitle-2" flat>
    <div class="pb-6">
      <div class="text-body-1 font-weight-bold text-uppercase">
        {{ totalInformation.title }}
      </div>
      <div class="d-flex align-center grey--text text--darken-2">
        <div class="font-weight-bold text-uppercase mr-2">
          {{ totalInformation.room }}
        </div>
        <v-divider vertical />
        <div class="font-weight-regular ml-2">
          {{ totalInformation.occupancy }} room occupancy
        </div>
      </div>
    </div>

    <v-divider />

    <div class="my-3 font-weight-regular">
      <div
        class="d-flex justify-space-between align-center"
        v-for="(i, index) in totalInformation.guest"
        :key="index"
      >
        <div>{{ i.title }}:</div>
        <div>{{ i.value }}</div>
      </div>
    </div>

    <v-divider />

    <div class="my-3 font-weight-regular">
      <div class="d-flex justify-space-between align-center">
        <div>Room Total:</div>
        <div>PhP. {{ totalInformation.totalPayment.roomTotal }}</div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <div>Extra Person Total:</div>
        <div>PhP. {{ totalInformation.totalPayment.extraPersonTotal }}</div>
      </div>
    </div>

    <v-divider />

    <div class="my-3 font-weight-regular">
      <div class="d-flex justify-space-between align-center">
        <div>Total:</div>
        <div>PhP. {{ totalInformation.totalPayment.total }}</div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <div>Total Received:</div>
        <div>PhP. {{ totalInformation.totalPayment.totalReceived }}</div>
      </div>
    </div>

    <v-divider />

    <div
      class="my-3 d-flex justify-space-between align-center font-weight-bold warning--text"
    >
      <div>Total Outstanding:</div>
      <div>PhP. {{ totalInformation.totalPayment.totalOutstanding }}</div>
    </div>

    <v-card-actions class="pa-0">
      <v-btn
        block
        depressed
        :outlined="totalInformation.button.outlined"
        color="primary"
        class="mt-4"
        @click="$emit('validation-event')"
        >{{ totalInformation.button.title }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "TotalBillCard",
  props: ["totalInformation"],
};
</script>
