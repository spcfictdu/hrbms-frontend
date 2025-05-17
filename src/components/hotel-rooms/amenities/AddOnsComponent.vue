<template>
  <div>
    <v-row justify="start">
      <v-col
        v-for="addOn in addOns"
        :key="addOn.name"
        class="pb-3 pb-sm-2"
        cols="12"
        md="3"
        sm="4"
      >
        <AddOnItem :addOn="addOn" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AddOnItem from "../addOns/AddOnItem.vue";

export default {
  name: "AddOnsComponent",
  components: { AddOnItem },
  methods: {
    ...mapActions("addOns", ["fetchAddOns"]),
  },
  computed: {
    ...mapState("addOns", ["addOns"]),
  },
  created() {
    this.fetchAddOns();
  },
};
</script>
