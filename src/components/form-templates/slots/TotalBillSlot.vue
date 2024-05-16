<template>
  <v-card class="pa-8 text-subtitle-2" flat>
    <div class="pb-6">
      <div class="text-body-1 font-weight-bold text-uppercase">
        The Serenity Suite
      </div>
      <div class="d-flex align-center grey--text text--darken-2">
        <div class="font-weight-bold text-uppercase mr-2">Deluxe Room</div>
        <v-divider vertical />
        <div class="font-weight-regular ml-2">5 maximum occupancy</div>
      </div>
    </div>

    <v-divider />

    <div
      class="my-3 d-flex justify-space-between align-center font-weight-regular"
    >
      <div>Guest Name:</div>
      <div>Dela Cruz, Juan</div>
    </div>

    <v-divider />

    <div class="my-3 font-weight-regular">
      <div class="d-flex justify-space-between align-center">
        <div>Room Total:</div>
        <div>PhP. 2000</div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <div>Extra Person Total:</div>
        <div>PhP. 0</div>
      </div>
    </div>

    <v-divider />

    <div class="my-3 font-weight-regular">
      <div class="d-flex justify-space-between align-center">
        <div>Total:</div>
        <div>PhP. 2000</div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <div>Total Received:</div>
        <div>PhP. 0</div>
      </div>
    </div>

    <v-divider />

    <div
      class="my-3 d-flex justify-space-between align-center font-weight-bold warning--text"
    >
      <div>Total Outstanding:</div>
      <div>PhP. 2000</div>
    </div>

    <v-card-actions class="pa-0">
        <v-btn block depressed color="primary" class="mt-4">Save Reservation</v-btn>
    </v-card-actions>
  </v-card>
</template>
