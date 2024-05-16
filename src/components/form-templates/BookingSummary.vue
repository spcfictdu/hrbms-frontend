<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Booking Summary </template>
    </title-slot>

    <div>
        <total-bill-slot />
    </div>
  </div>
</template>

<script>
import TitleSlot from "./slots/TitleSlot.vue";
import TotalBillSlot from "./slots/TotalBillSlot.vue"
export default {
  name: "TransactionTemplate",
  data: () => ({
    payload: {
      province: null,
      cityMunicipality: null,
    },
  }),
  components: {
    TitleSlot,
    TotalBillSlot,
  },
  methods: {},
};
</script>

<style scoped></style>
