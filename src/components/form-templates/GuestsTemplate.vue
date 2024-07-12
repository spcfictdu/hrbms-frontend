<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Guests </template>
    </title-slot>

    <div>
      <label-slot>
        <template v-slot:label> Extra Person </template>
      </label-slot>
      <v-select
        hide-details="auto"
        v-model="payload.guests"
        dense
        outlined
        @change="emitTransaction"
        :items="guestsEnums"
      ></v-select>
    </div>
  </div>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
import TitleSlot from "../slots/TitleSlot.vue";
export default {
  name: "GuestsTemplate",
  props: ["guestsEnums", "fill"],
  data: () => ({
    payload: {
      guests: 0,
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
      return errors;
    },
  },
  mounted() {
    this.emitTransaction();
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (newVal?.extraPerson) {
          this.payload.guests = newVal.extraPerson;
          this.$emit("emit-transaction", this.payload);
        } else {
          this.payload.guests = null;
        }
      },
    },
  },
};
</script>

<style scoped></style>
