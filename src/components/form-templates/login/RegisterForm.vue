<template>
  <div>
    <div class="pb-4">
      <label-slot>
        <template #label> First Name </template>
      </label-slot>
      <v-text-field
        v-model="payload.firstName"
        outlined
        dense
        rounded
        hide-details="auto"
      />
    </div>

    <div class="pb-4">
      <label-slot>
        <template #label> Middle Name </template>
      </label-slot>
      <v-text-field
        v-model="payload.middleName"
        outlined
        dense
        rounded
        hide-details="auto"
      />
    </div>

    <div class="pb-4">
      <label-slot>
        <template #label> Last Name </template>
      </label-slot>
      <v-text-field
        v-model="payload.lastName"
        outlined
        dense
        rounded
        hide-details="auto"
      />
    </div>

    <div class="pb-4">
      <label-slot>
        <template #label> Mobile Number </template>
      </label-slot>
      <v-text-field
        type="number"
        v-model="payload.mobileNumber"
        outlined
        dense
        rounded
        hide-details="auto"
      />
    </div>

    <div class="pb-4">
      <label-slot>
        <template #label> Email </template>
      </label-slot>
      <v-text-field
        type="email"
        v-model="payload.email"
        outlined
        dense
        rounded
        hide-details="auto"
      />
    </div>

    <div class="pb-4">
      <label-slot>
        <template #label> Password </template>
      </label-slot>
      <v-text-field
        v-model="payload.password"
        type="password"
        outlined
        dense
        rounded
        hide-details="auto"
      />
    </div>
  </div>
</template>

<script>
import LabelSlot from '@/components/slots/LabelSlot.vue';
export default {
  name: "RegisterForm",
  components: { LabelSlot },
  data: () => ({
    payload: {
      firstName: null,
      middleName: null,
      lastName: null,
      mobileNumber: null,
      email: null,
      password: null,
    }
  }),
  methods: {

  }
};
</script>

<style scoped></style>
