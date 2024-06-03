<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Guest Name </template>
    </title-slot>

    <div>
      <label-slot>
        <template v-slot:label> First Name </template>
      </label-slot>
      <v-text-field
        dense
        hide-details="auto"
        outlined
        :rules="rules.firstName"
        v-model="payload.firstName"
        @change="emitTransaction"
      ></v-text-field>
    </div>

    <div class="my-4">
      <label-slot>
        <template v-slot:label> Middle Name </template>
      </label-slot>
      <v-text-field
        dense
        hide-details="auto"
        outlined
        v-model="payload.middleName"
        @change="emitTransaction"
      ></v-text-field>
    </div>

    <div>
      <label-slot>
        <template v-slot:label> Last Name </template>
      </label-slot>
      <v-text-field
        dense
        hide-details="auto"
        outlined
        :rules="rules.lastName"
        v-model="payload.lastName"
        @change="emitTransaction"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
import TitleSlot from "../slots/TitleSlot.vue";
export default {
  name: "GuestNameTemplate",
  props: ["fill"],
  data: () => ({
    payload: {
      firstName: null,
      middleName: null,
      lastName: null,
    },
  }),
  components: {
    TitleSlot,
    LabelSlot,
  },
  methods: {
    emitTransaction: function () {
      this.$emit("emit-transaction", this.payload);
    },
  },
  computed: {
    rules() {
      const errors = {};
      errors.firstName = [(v) => !!v || "First name is required"];
      errors.lastName = [(v) => !!v || "Last name is required"];
      return errors;
    },
  },
  watch: {
    fill: {
      deep: true,
      handler: function (newVal) {
        if (newVal) {
          this.payload = {
            firstName: newVal.first_name,
            middleName: newVal.middle_name,
            lastName: newVal.last_name,
          };
        } else {
          this.payload = {
            firstName: null,
            middleName: null,
            lastName: null,
          };
        }
        this.$emit("emit-transaction", this.payload);
      },
    },
  },
};
</script>

<style scoped></style>
