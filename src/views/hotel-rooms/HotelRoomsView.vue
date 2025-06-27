<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <HotelRoomsHeader />
    <router-view />
  </div>
</template>

<script>
import HotelRoomsHeader from "../../components/headers/HotelRoomsHeader.vue";
import { mapMutations } from "vuex";
export default {
  name: "HotelRoomsView",
  components: { HotelRoomsHeader },
  data: () => ({
    hello: "world",
  }),
  beforeDestroy() {
    this.SET_TRANSACTION(null);
  },
  methods: {
    ...mapMutations("transaction", ["SET_TRANSACTION"]),
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
