<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Address </template>
    </title-slot>

    <div>
      <label-slot>
        <template v-slot:label> Province </template>
      </label-slot>
      <v-text-field
        dense
        hide-details="auto"
        outlined
        :rules="rules.province"
        v-model="payload.address.province"
        @change="emitTransaction"
      ></v-text-field>
    </div>

    <div class="mt-4">
      <label-slot>
        <template v-slot:label> City/Municipality </template>
      </label-slot>
      <v-text-field
        dense
        hide-details="auto"
        outlined
        :rules="rules.city"
        v-model="payload.address.city"
        @change="emitTransaction"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
import TitleSlot from "../slots/TitleSlot.vue";
export default {
  name: "AddressTemplate",
  props: ["fill"],
  data: () => ({
    payload: {
      address: {
        province: null,
        city: null,
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
      errors.province = [(v) => !!v || "Province is required"];
      errors.city = [(v) => !!v || "City/Municipality is required"];
      return errors;
    },
  },
  watch: {
    fill: {
      deep: true,
      handler: function (newVal) {
        if (newVal) {
          this.payload.address = {
            province: newVal.province,
            city: newVal.city,
          };
        } else {
          this.payload.address = {
            province: null,
            city: null,
          };
        }
        this.$emit("emit-transaction", this.payload);
      },
    },
  },
};
</script>

<style scoped></style>
