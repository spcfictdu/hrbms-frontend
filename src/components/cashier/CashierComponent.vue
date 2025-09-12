<template>
  <div>
    <div>
      <div class="text-uppercase primary--text font-weight-bold text-h6">
        First Floor Lobby
      </div>
      <div v-if="session" class="text-uppercase">
        EMPLOYEE:
        <span v-if="session.fullName">{{ session.fullName }} | </span>
        <span v-else-if="!session.message">{{
          `${$auth.user().firstName} ${$auth.user().lastName} | `
        }}</span>

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
              @onCancelReservation="handleCancelReservation"
            />
          </div>

          <div v-if="selectedTransaction">
            <v-divider></v-divider>
            <AddOnsTemplate :fill="fill" @emit-transaction="assignPayload" />

            <v-divider></v-divider>
            <DiscountTemplate :fill="fill" @emit-transaction="assignPayload" />
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
    tempAddons: [],
  }),
  methods: {
    ...mapActions("transaction", [
      "fetchTransactions",
      "fetchTransaction",
      "deleteReservation",
    ]),
    ...mapMutations("transaction", ["SET_TRANSACTION"]),
    ...mapMutations("transaction", ["ADD_TRANSACTION"]),
    ...mapActions("roomEnum", ["fetchRoom"]),
    ...mapActions("alerts", ["requireAlertFn"]),

    assignPayload(payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          const value = payload[key];
          if (value === null) {
            this.$delete(this.payload, key);
          } else if (key === "addons") {
            this.$set(this.payload, key, [...this.tempAddons, ...value]);
          } else {
            this.$set(this.payload, key, payload[key]);
          }
        }
      }
    },

    handleTransactionUpdate() {
      const { referenceNumber, status } = this.transaction.transaction;
      const {
        payment,
        addons: payloadAddons,
        discount,
        idNumber,
        voucherCode,
      } = this.payload;

      const addons = payloadAddons?.slice(this.tempAddons.length);

      let reservationPayload = {
        referenceNumber,
        status,
        addons,
        ...payment,
      };

      if (
        this.fill?.discount &&
        !Object.values(this.fill.discount).every((v) => !!v)
      ) {
        reservationPayload = {
          ...reservationPayload,
          voucherCode,
          discount,
          idNumber,
        };
      }

      const bookingPayload = {
        ...this.savedPayload,
        addons,
        ...(discount && { discount }),
        voucherCode,
        idNumber,
        payment,
        status,
      };

      const payload = status === "BOOKED" ? bookingPayload : reservationPayload;
      if (this.$auth.user().role === "ADMIN")
        payload.cashierId = this.session.userId;

      if (this.$refs.form.validate()) {
        this.$emit("onSubmit", payload);
      }
    },
    async handleClick(referenceNum, fullName) {
      if (this.selectedTransaction === referenceNum) return;

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

      if (this.formDetails && this.selectedTransaction.length <= 8) {
        await this.fetchRoom({
          roomNumber: this.formDetails.roomNumber,
        });
        this.addBookedTransaction();
        return;
      }
      await this.fetchTransaction(this.selectedTransaction);

      this.tempAddons = this.transaction.priceSummary.fullAddons.map((fa) => ({
        ...fa,
        name: fa.name.trim(),
        quantity: String(fa.quantity),
      }));

      // this.payload = {
      //   ...this.payload,
      //   addons: this.transaction.priceSummary.fullAddons.map((fa) => ({
      //     name: fa.name.trim(),
      //     quantity: fa.quantity,
      //   })),
      // };

      this.fill = {
        // addons: this.transaction.priceSummary.fullAddons.map((fa) => ({
        //   name: fa.name.trim(),
        //   quantity: fa.quantity,
        // })),
        discount: {
          discount: this.transaction.priceSummary.discountName,
          idNumber:
            this.transaction.priceSummary.idNumber ??
            this.transaction.priceSummary.voucherCode,
        },
      };
    },

    addBookedTransaction() {
      const activeTransaction = {
        guestName: this.fullName,
        room: {
          name: this.room[0].roomType,
          number: Number(this.savedPayload.roomNumber),
          capacity: this.room[0].roomTypeCapacity,
        },
        transaction: {
          checkInDate: this.savedPayload.checkIn.date,
          checkOutDate: this.savedPayload.checkOut.date,
          extraPerson: this.savedPayload.guest.extraPerson,
          status: "BOOKED",
        },
        priceSummary: {
          fullAddons: [],
        },
        paymentSummary: [],
        transactionRefNum: this.savedPayload.room.referenceNumber,
      };
      this.SET_TRANSACTION(activeTransaction);
      return activeTransaction;
    },

    async handleCancelReservation(payload) {
      this.requireAlertFn(2);

      await this.deleteReservation(payload);
      this.guestName = "";
      this.selectedTransaction = null;
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
      } else if (
        this.transaction.priceSummary.discount &&
        this.transaction.priceSummary.discount !== "0%"
      ) {
        receiptQuery.voucherCode = this.payload.voucherCode;
        receiptQuery.discount = this.payload.discount;
      }

      receiptQuery.addons = this.payload.addons ?? this.tempAddons;

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
    fullName() {
      const { firstName, middleName, lastName } = this.savedPayload.guest;
      const fullName = middleName
        ? `${lastName}, ${firstName} ${middleName}`
        : `${lastName}, ${firstName}`;

      return fullName;
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
      await this.fetchRoom({
        roomNumber: this.formDetails.roomNumber,
      });

      const transaction = {
        booked: null,
        checkInDate: this.savedPayload.checkIn.date,
        checkOutDate: this.savedPayload.checkOut.date,
        fullName: this.fullName,
        room: {
          name: this.room[0].roomType,
          number: Number(this.savedPayload.roomNumber),
          capacity: this.room[0].roomTypeCapacity,
        },
        status: "BOOKED",
        transactionRefNum: this.savedPayload.room.referenceNumber,
      };
      this.ADD_TRANSACTION(transaction);

      const activeTransaction = this.addBookedTransaction();
      this.handleClick(
        activeTransaction.transactionRefNum,
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
