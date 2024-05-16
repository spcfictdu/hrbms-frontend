<template>
  <v-container>
    <v-row>
      <v-col cols="12"><div :class="title">Transactions</div></v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <v-divider></v-divider>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TransactionsTable",
  data: () => ({
    title: "text-h5 font-weight-black",
  }),
  watch: {
    "$vuetify.breakpoint": {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.xs === true) {
          this.title = "d-flex text-h6 font-weight-black justify-center mt-n3";
        } else {
          this.title = "text-h5 font-weight-black";
        }
      },
    },
  },
};
</script>

<style scoped></style>
