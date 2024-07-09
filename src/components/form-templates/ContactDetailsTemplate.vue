<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Contact Details </template>
    </title-slot>

    <v-row>
      <v-col cols="12" md="6">
        <label-slot>
          <template v-slot:label> Phone Number </template>
        </label-slot>
        <v-text-field
          type="number"
          dense
          hide-details="auto"
          outlined
          :rules="rules.phoneNumber"
          counter="11"
          v-model="payload.contact.phoneNumber"
          @change="emitTransaction"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <label-slot>
          <template v-slot:label> Email </template>
        </label-slot>
        <v-text-field
          type="email"
          dense
          hide-details="auto"
          outlined
          :rules="rules.email"
          v-model="payload.contact.email"
          @change="emitTransaction"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
import TitleSlot from "../slots/TitleSlot.vue";
export default {
  name: "ContactDetailsTemplate",
  props: ["fill"],
  data: () => ({
    payload: {
      contact: {
        phoneNumber: null,
        email: null,
      },
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
      errors.phoneNumber = [(v) => !!v || "Phone number is required"];
      errors.email = [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ];
      return errors;
    },
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.payload.contact = {
            phoneNumber: newVal.phone_number,
            email: newVal.email,
          };
          this.$emit("emit-transaction", this.payload);
        } else {
          this.payload.contact = {
            phoneNumber: null,
            email: null,
          };
        }
      },
    },
  },
};
</script>

<style scoped></style>
