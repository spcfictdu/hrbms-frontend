<template>
  <div>
    <v-row justify="start">
      <v-col
        v-for="addOn in data"
        :key="addOn.name"
        class="pb-3 pb-sm-2"
        cols="12"
        md="3"
        sm="4"
      >
        <AddOnItem :addOn="addOn" @onSelect="handleSelect" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddOnItem from "../addOns/AddOnItem.vue";

export default {
  name: "AddOnsComponent",
  components: { AddOnItem },
  props: {
    data: Array,
  },
  methods: {
    handleSelect(option, refNum, addOnName, addOnPrice) {
      this.$emit("onSelect", option, refNum, addOnName, addOnPrice);
    },
  },
};
</script>
