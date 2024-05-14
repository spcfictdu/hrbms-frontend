<template>
  <v-container>
    <v-row>
      <div class="text-h5 font-weight-black mt-n5">Guests</div>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="mt-5"><v-divider></v-divider></div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="elevation-0 text-h6 font-weight-black ml-3"
            >{{ guests.length }} GUESTS
            <v-spacer></v-spacer>
            <v-btn color="primary" rounded v-if="show" class="text-button"><v-icon>mdi-magnify</v-icon>Search</v-btn>
            <v-btn icon @click="show = !show" large color="primary">
              <v-icon>{{
                show
                  ? "mdi-chevron-up-circle-outline"
                  : "mdi-chevron-down-circle-outline"
              }}</v-icon>
            </v-btn>
          </v-card-title>
          <v-progress-linear color="amber" indeterminate></v-progress-linear>
          <v-data-table
          :headers="headers"
          :items="guests"
          class="ma-5">
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "GuestListTable",
  data: () => ({
    guests: [
        {
            name: "Juan dela Cruz",
            booking: "BKG-987654-20240514",
            email: "juan.delacruz@gmail.com",
            phone: "09123456789",
        },
        {
            name: "Maria Santos",
            booking: "BKG-234567-20240514",
            email: "jose.rizal@gmail.com",
            phone: "09229876543",
        }, 
        {
            name: "Jose Rizal",
            booking: "BKG-345678-20240514",
            email: "juan.delacruz@gmail.com",
            phone: "09229876543",
        },
        {
            name: "Angelica Reyes",
            booking: "BKG-456789-20240514",
            email: "angelica.reyes@gmail.com",
            phone: "09278765432",
        }, 
        {
            name: " Manuel Gonzales",
            booking: "BKG-567890-20240514",
            email: "manuel.gonzales@gmail.com",
            phone: "09187654321",
        }, 
    ],
    show: false,
    headers: [
        {
            text: 'Name',
            value: 'name'
        },
        {
            text: 'Booking Reference',
            value: 'booking'
        },
        {
            text: 'Email',
            value: 'email'
        },
        {
            text: 'Phone',
            value: 'phone'
        },
    ],
    textfieldHeaders: ["First Name", "Middle Name", "Last Name", "Booking Reference", "Email", "Phone"]
  }),
};
</script>

<style scoped></style>
