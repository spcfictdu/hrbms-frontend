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

          <div v-if="guestName && filteredTransactions.length">
            <GuestCard
              v-for="transaction in filteredTransactions"
              :key="transaction.transactionRefNum"
              :transaction="transaction"
              @onClick="handleClick"
            />
          </div>

          <div v-if="selectedTransaction">
            <v-divider></v-divider>
            <AddOnsTemplate :fill="fill" @emit-transaction="assignPayload" />

            <v-divider></v-divider>
            <DiscountTemplate @emit-transaction="assignPayload" />
          </div>
        </v-col>

        <v-col v-if="selectedTransaction" cols="12" md="6">
          <v-divider></v-divider>
          <PaymentTemplate @emit-transaction="assignPayload" />

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
    totalPayment: 0,
    fill: null,
  }),
  methods: {
    ...mapActions("transaction", ["fetchTransactions", "fetchTransaction"]),
    ...mapMutations("transaction", ["SET_TRANSACTION"]),
    ...mapMutations("transaction", ["ADD_TRANSACTION"]),
    ...mapActions("roomEnum", ["fetchRoom"]),
    assignPayload(payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          const value = payload[key];
          if (value === null) {
            this.$delete(this.payload, key);
          } else {
            this.$set(this.payload, key, payload[key]);
          }
        }
      }
    },
    handleTransactionUpdate() {
      const { referenceNumber, status } = this.transaction.transaction;
      const { payment, addons, discount, idNumber, voucherCode } = this.payload;

      const reservationPayload = {
        referenceNumber,
        status,
        addons,
        discount,
        idNumber,
        voucherCode,
        ...payment,
      };

      const bookingPayload = {
        ...this.savedPayload,
        addons,
        discount,
        voucherCode,
        idNumber,
        payment,
        status,
      };

      if (this.$refs.form.validate()) {
        this.$emit(
          "onSubmit",
          status === "BOOKED" ? bookingPayload : reservationPayload
        );
      }
    },
    async handleClick(referenceNum, fullName) {
      // Reset payload and fill
      this.payload = {
        payment: {
          amountReceived: 0,
          paymentType: null,
        },
      };
      this.fill = null;

      this.selectedTransaction = referenceNum;
      this.guestName = fullName;

      if (this.formDetails) return;
      await this.fetchTransaction(this.selectedTransaction);
      this.fill = {
        addons: this.transaction.priceSummary.fullAddons.map((fa) => ({
          name: fa.name.trim(),
          quantity: fa.quantity,
        })),
      };
    },
  },
  computed: {
    ...mapState("transaction", ["transactions", "loading", "transaction"]),
    ...mapState("vouchers", ["activeVoucher"]),
    ...mapState("roomEnum", ["room"]),
    formDetails() {
      return JSON.parse(sessionStorage.getItem("formDetails"));
    },
    savedPayload() {
      return JSON.parse(sessionStorage.getItem("payload"));
    },
    activeTransactions() {
      if (!this.transactions) return [];
      return this.transactions.data.filter((t) => t.status !== "CHECKED-OUT");
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

      const receiptQuery = {
        roomType: this.transaction.room.name,
        roomNumber: this.transaction.room.number,
        dateRange: [
          this.transaction.transaction.checkInDate,
          this.transaction.transaction.checkOutDate,
        ],
        extraPersonCount: this.transaction.transaction.extraPerson,
        addons: this.transaction.priceSummary.fullAddons,
      };

      if (!this.payload.discount) {
        this.$delete(receiptQuery, "discount");
        this.$delete(receiptQuery, "voucherCode");
      }

      if (this.payload.discount && this.payload.discount !== "VOUCHER")
        receiptQuery.discount = this.payload.discount;

      if (this.activeVoucher && this.payload.discount === "VOUCHER") {
        receiptQuery.voucherCode = this.activeVoucher.code;
        receiptQuery.discount = this.payload.discount;
      }

      receiptQuery.addons = this.payload.addons;

      return receiptQuery;
    },
    clientMeta() {
      if (!this.transaction) return {};

      const transactionPaymentSummary =
        this.transaction.paymentSummary.reduce(
          (total, payment) => total + Number(payment.amountReceived),
          0
        ) ?? 0;
      const amountReceived =
        transactionPaymentSummary + this.payload.payment.amountReceived;

      return {
        status: this.transaction.transaction.status,
        clientName: this.transaction.guestName,
        amountReceived,
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
    await this.fetchTransactions({ perPage: 100 });
    // await this.fetchTransactions();

    if (this.transaction) {
      this.handleClick(
        this.transaction.transaction.referenceNumber,
        this.transaction.guestName
      );
      return;
    }

    if (this.savedPayload && this.formDetails) {
      const { firstName, middleName, lastName } = this.savedPayload.guest;
      const fullName = middleName
        ? `${lastName}, ${firstName} ${middleName}`
        : `${lastName}, ${firstName}`;

      await this.fetchRoom({
        roomNumber: this.formDetails.roomNumber,
      });

      const transaction = {
        booked: null,
        checkInDate: this.savedPayload.checkIn.date,
        checkOutDate: this.savedPayload.checkOut.date,
        fullName,
        occupants: this.room[0].roomTypeCapacity,
        room: Number(this.savedPayload.roomNumber),
        status: "BOOKED",
        roomType: this.room[0].roomType,
        transactionRefNum: this.savedPayload.room.referenceNumber,
      };
      this.ADD_TRANSACTION(transaction);

      const activeTransaction = {
        guestName: fullName,
        room: {
          name: transaction.roomType,
          number: transaction.room,
        },
        transaction: {
          checkInDate: transaction.checkInDate,
          checkOutDate: transaction.checkOutDate,
          extraPerson: this.savedPayload.guest.extraPerson,
          status: transaction.status,
        },
        priceSummary: {
          fullAddons: [],
        },
        paymentSummary: [],
      };
      this.SET_TRANSACTION(activeTransaction);
      this.handleClick(
        transaction.transactionRefNum,
        this.transaction.guestName
      );
    }
  },
  beforeDestroy() {
    this.SET_TRANSACTION(null);
    sessionStorage.removeItem("formDetails");
    sessionStorage.removeItem("payload");
  },
};
</script>
