<template>
  <div>
    <span class="price--text font-weight-bold"
      >PHP {{ price }}<small>/NIGHT</small></span
    >
    {{ ` | ${maxOccupancy} max occupancy` }}
  </div>
</template>

<script>
export default {
  name: "PriceSlot",
  props: {
    price: Number,
    maxOccupancy: Number,
  },
};
</script>

<style scoped>
.price--text {
  color: #db8300;
}
</style>
