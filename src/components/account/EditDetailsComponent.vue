<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <label-slot>
          <template #label>First Name</template>
        </label-slot>
        <v-text-field background-color="white" dense outlined hide-details="auto"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <label-slot>
          <template #label>Middle Name</template>
        </label-slot>
        <v-text-field background-color="white" dense outlined hide-details="auto"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <label-slot>
          <template #label>Last Name</template>
        </label-slot>
        <v-text-field background-color="white" dense outlined hide-details="auto"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <label-slot>
          <template #label>Booking Reference</template>
        </label-slot>
        <v-text-field background-color="white" dense outlined hide-details="auto"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <label-slot>
          <template #label>Email</template>
        </label-slot>
        <v-text-field background-color="white" type="email" dense outlined hide-details="auto"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <label-slot>
          <template #label>Phone</template>
        </label-slot>
        <v-text-field background-color="white" counter="11" maxLength="11" type="tel" dense outlined
                      hide-details="auto"></v-text-field>
      </v-col>
    </v-row>

    <div
        class="mt-4 d-flex flex-column-reverse flex-sm-row justify-center justify-sm-end align-center"
    >
      <v-btn
          class="mr-0 mr-sm-4 mt-4 mt-sm-0" :block="$vuetify.breakpoint.xs" outlined color="primary"
      >Cancel
      </v-btn>
      <v-btn color="primary" :block="$vuetify.breakpoint.xs">Save Changes</v-btn>
    </div>
  </div>
</template>

<script>
import LabelSlot from "@/components/slots/LabelSlot.vue";

export default {
  name: "EditDetailsComponent",
  components: { LabelSlot },
  data: () => ({}),
}
</script>

<style scoped>

</style>