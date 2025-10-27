<template>
  <v-row justify="start" v-if="loading">
    <v-col
      v-for="n in 20"
      :key="n"
      class="pb-3 pb-sm-2"
      cols="12"
      md="3"
      sm="4"
    >
      <v-skeleton-loader height="70" type="button" />
    </v-col>
  </v-row>

  <v-row justify="start" v-else>
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
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AddOnItem from "../addOns/AddOnItem.vue";

export default {
  name: "AddOnsComponent",
  components: { AddOnItem },
  props: {
    data: Array,
  },
  methods: {
    ...mapActions("addOns", ["fetchAddOns"]),
    handleSelect(option, refNum, addOnName, addOnPrice) {
      this.$emit("onSelect", option, refNum, addOnName, addOnPrice);
    },
  },
  computed: {
    ...mapGetters("addOns", ["getLoading"]),

    loading() {
      return this.getLoading("addons") && !this.data.length;
    },
  },
  created() {
    this.fetchAddOns();
  },
};
</script>

<style scoped>
.v-skeleton-loader >>> .v-skeleton-loader__button {
  width: 100%;
  height: 100%;
}
</style>
