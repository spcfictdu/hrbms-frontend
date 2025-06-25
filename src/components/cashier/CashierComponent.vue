<template>
  <div>
    <div>
      <div class="text-uppercase primary--text font-weight-bold text-h6">
        First Floor Lobby
      </div>
      <div class="text-uppercase">
        EMPLOYEE: {{ session.userFullName }} |
        <span class="font-weight-bold">S{{ session.userId }}</span>
      </div>
    </div>

    <v-form class="mt-12">
      <v-row>
        <v-col cols="12" md="6">
          <v-divider></v-divider>
          <FormSection title="Guest Name">
            <v-text-field
              dense
              hide-details
              outlined
              append-icon="mdi-magnify"
              v-model="guestName"
              class="mr-3"
              @input="guestName = guestName.toUpperCase()"
            />
          </FormSection>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import FormSection from "../sections/FormSection.vue";

export default {
  components: { FormSection },
  name: "CashierComponent",
  props: { id: String },
  data: () => ({
    guestName: "",
  }),
  methods: {
    ...mapActions("transaction", ["fetchTransactions"]),
  },
  computed: {
    ...mapState("transactions", ["transactions"]),
    ...mapGetters("cashier", ["getSession"]),
    session() {
      return this.getSession(this.id);
    },
  },
  created() {
    this.fetchTransactions();
  },
};
</script>
