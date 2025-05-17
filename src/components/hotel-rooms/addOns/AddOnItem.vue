<template>
  <v-btn
    class="capitalizeText text-subtitle-2 font-weight-regular"
    height="70px"
    depressed
    block
    color="lightBg"
  >
    <div>
      <div>{{ addOn.name }}</div>
      <div class="font-weight-bold text-body-1">₱{{ addOn.price }}</div>
    </div>
  </v-btn>
</template>

<script>
export default {
  name: "AddOnItem",
  props: {
    addOn: Object,
  },
};
</script>
