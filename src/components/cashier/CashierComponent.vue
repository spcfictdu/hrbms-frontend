<template>
  <div>
    <div>
      <div class="text-uppercase primary--text font-weight-bold text-h6">
        First Floor Lobby
      </div>
      <div v-if="session" class="text-uppercase">
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

          <div v-if="guestName">
            <GuestCard
              v-for="transaction in filteredTransactions"
              :key="transaction.transactionRefNum"
              :transaction="transaction"
              @onClick="(v) => (selectedTransaction = v)"
            />
          </div>

          <div v-if="selectedTransaction">
            <v-divider></v-divider>
            <AddOnsTemplate />

            <v-divider></v-divider>
            <DiscountTemplate />
          </div>
        </v-col>

        <v-col v-if="selectedTransaction" cols="12" md="6">
          <v-divider></v-divider>
          <PaymentTemplate />

          <!-- <v-divider></v-divider>
          <BookingSummary /> -->
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AddOnsTemplate from "../form-templates/AddOnsTemplate.vue";
import BookingSummary from "../form-templates/BookingSummary.vue";
import DiscountTemplate from "../form-templates/DiscountTemplate.vue";
import PaymentTemplate from "../form-templates/PaymentTemplate.vue";
import GuestCard from "../guests/GuestCard.vue";
import FormSection from "../sections/FormSection.vue";

export default {
  name: "CashierComponent",
  components: {
    FormSection,
    GuestCard,
    AddOnsTemplate,
    DiscountTemplate,
    PaymentTemplate,
    BookingSummary,
  },
  props: { session: Object },
  data: () => ({
    guestName: "",
    selectedTransaction: null,
  }),
  methods: {
    ...mapActions("transaction", ["fetchTransactions"]),
  },
  computed: {
    ...mapState("transaction", ["transactions"]),
    filteredTransactions() {
      return this.transactions.data.filter((t) => {
        if (this.selectedTransaction) {
          return this.selectedTransaction === t.transactionRefNum;
        }
        return t.fullName.match(this.guestName);
      });
    },
  },
  async created() {
    await this.fetchTransactions();
    console.log(this.transactions);
  },
  watch: {
    guestName() {
      this.selectedTransaction = null;
    },
  },
};
</script>
