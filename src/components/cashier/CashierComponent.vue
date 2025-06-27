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

    <v-form
      class="mt-12"
      ref="form"
      lazy-validation
      @submit.prevent="handleTransactionUpdate"
    >
      <v-row>
        <v-col cols="12" md="6">
          <v-divider></v-divider>
          <FormSection title="Guest Name">
            <v-autocomplete
              :items="guestNames"
              dense
              hide-details
              outlined
              v-model="guestName"
              class="mr-3"
              clearable
              @input="selectedTransaction = null"
              @keydown="selectedTransaction = null"
            />
          </FormSection>

          <div v-if="guestName">
            <GuestCard
              v-for="transaction in filteredTransactions"
              :key="transaction.transactionRefNum"
              :transaction="transaction"
              @onClick="handleClick"
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
          <PaymentTemplate
            :isGreater="totalPayment"
            @emit-transaction="assignPayload"
          />

          <v-divider></v-divider>
          <BookingSummary
            :loading="loading.form"
            :queryParams="receiptQuery"
            :clientMeta="clientMeta"
            :btnStyling="btnStyling"
            @totalPayment="(v) => (totalPayment = v)"
          />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
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
    payload: {
      payment: {
        amountReceived: 0,
        paymentType: null,
      },
    },
    guestName: "",
    selectedTransaction: null,
    formDetails: null,
    totalPayment: 0,
  }),
  methods: {
    ...mapActions("transaction", ["fetchTransactions", "fetchTransaction"]),
    ...mapMutations("transaction", ["SET_TRANSACTION"]),
    assignPayload(payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },
    handleTransactionUpdate() {
      const { referenceNumber, status } = this.transaction.transaction;
      const { payment } = this.payload;

      let payload = {
        referenceNumber,
        status,
        ...payment,
      };

      if (this.$refs.form.validate()) {
        this.$emit("onSubmit", payload);
      }
    },
    async handleClick(referenceNum, fullName) {
      this.selectedTransaction = referenceNum;
      this.guestName = fullName;
      await this.fetchTransaction(this.selectedTransaction);
    },
    loadSessionStorage() {
      const formDetails = JSON.parse(sessionStorage.getItem("formDetails"));
      if (!formDetails || !formDetails.lastName) return;
      this.formDetails = formDetails;
    },
  },
  computed: {
    ...mapState("transaction", ["transactions", "loading", "transaction"]),
    activeTransactions() {
      return (
        this.transactions.data.filter((t) => t.status !== "CHECKED-OUT") ?? []
      );
    },
    guestNames() {
      return this.activeTransactions.map((t) => t.fullName);
    },
    filteredTransactions() {
      return (
        this.activeTransactions.filter((t) => {
          if (this.selectedTransaction) {
            return this.selectedTransaction === t.transactionRefNum;
          }

          return t.fullName.toUpperCase().match(this.guestName.toUpperCase());
        }) ?? []
      );
    },
    receiptQuery() {
      if (!this.transaction) return {};

      return {
        roomType: this.transaction.room.name,
        roomNumber: this.transaction.room.number,
        dateRange: [
          this.transaction.transaction.checkInDate,
          this.transaction.transaction.checkOutDate,
        ],
        extraPersonCount: this.transaction.transaction.extraPerson,
        addons: this.transaction.priceSummary.fullAddons,
      };
    },
    clientMeta() {
      if (!this.transaction) return {};

      return {
        status: this.transaction.transaction.status,
        clientName: this.transaction.guestName,
        amountReceived: this.payload.payment.amountReceived,
      };
    },
    btnStyling() {
      const btnProps = this.$route.meta.formBtn;
      return btnProps;
    },
    guestNameChange() {
      return this.guestName;
    },
  },
  async created() {
    await this.fetchTransactions();

    if (this.transaction) {
      this.selectedTransaction = this.transaction.transaction.referenceNumber;
      this.guestName = this.transaction.guestName;
      return;
    }

    this.loadSessionStorage();

    if (this.formDetails) {
      const transaction = this.transactions.data.find(
        (t) => this.formDetails.roomNumber === t.room
      );
      if (!transaction) return;
      this.selectedTransaction = transaction.transactionRefNum;
      this.guestName = transaction.fullName;
      await this.fetchTransaction(this.selectedTransaction);
    }
  },
  beforeDestroy() {
    this.SET_TRANSACTION(null);
  },
};
</script>
