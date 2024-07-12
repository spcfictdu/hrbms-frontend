<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> ID </template>
    </title-slot>

    <v-row>
      <v-col cols="12" md="6">
        <label-slot>
          <template v-slot:label> Type </template>
        </label-slot>
        <v-select
          hide-details="auto"
          outlined
          dense
          :items="IdEnums"
          :rules="rules.type"
          v-model="payload.id.type"
          @change="emitTransaction"
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <label-slot>
          <template v-slot:label> ID Number </template>
        </label-slot>
        <v-text-field
          dense
          hide-details="auto"
          outlined
          :rules="rules.IdNumber"
          v-model="payload.id.number"
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
  name: "IdentificationTemplate",
  props: ["fill"],
  data: () => ({
    payload: {
      id: {
        type: null,
        number: null,
      },
    },
    IdEnums: ["National ID", "Driver's License", "Passport"],
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
      errors.type = [(v) => !!v || "Id type is required"];
      errors.IdNumber = [(v) => !!v || "Id number is required"];
      return errors;
    },
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (newVal?.id) {
          this.payload.id = {
            type: newVal.id.type,
            number: newVal.id.number,
          };
          this.$emit("emit-transaction", this.payload);
        } else {
          this.payload.id = {
            type: null,
            number: null,
          };
        }
      },
    },
  }
};
</script>

<style scoped></style>
