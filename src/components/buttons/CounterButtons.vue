<template>
  <div class="d-flex align-center flex-nowrap" style="gap: 8px">
    <v-btn
      small
      color="white"
      :ripple="false"
      depressed
      icon
      class="primary"
      style="border-radius: 5px"
      @click="decrementFn"
    >
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <div class="px-2 font-weight-bold">{{ quantity }}</div>
    <v-btn
      small
      color="white"
      :ripple="false"
      depressed
      icon
      class="primary"
      style="border-radius: 5px"
      @click="incrementFn"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "CounterButtons",
  props: {
    quantity: Number,
    incrementFn: Function,
    decrementFn: Function,
  },
};
</script>

<style scoped></style>
