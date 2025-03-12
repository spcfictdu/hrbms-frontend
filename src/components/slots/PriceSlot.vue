<template>
  <span class="price--text font-weight-bold"
    >PHP {{ price }}<small>/NIGHT</small></span
  >
</template>

<script>
export default {
  name: "PriceSlot",
  props: {
    price: String,
  },
};
</script>

<style scoped>
.price--text {
  color: #db8300;
}
</style>
