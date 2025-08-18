<template>
  <v-card class="pa-4 pa-md-8 text-subtitle-2" flat>
    <div class="pb-6">
      <div class="text-body-1 font-weight-bold text-uppercase">
        {{ value.receiptEnums.type }}
      </div>
      <div class="d-flex align-center grey--text text--darken-2">
        <div class="font-weight-bold text-uppercase mr-2">
          Room {{ value.receiptEnums.roomNumber }}
        </div>
        <v-divider vertical />
        <div class="font-weight-regular ml-2">
          Good for {{ value.receiptEnums.capacity }} persons
        </div>
      </div>
    </div>

    <div class="text-body-2 font-weight-bold text-uppercase mb-1">
      Accomodation Details
    </div>

    <v-divider />

    <div class="my-3 font-weight-regular">
      <div
        class="d-flex justify-space-between align-center"
        v-for="(i, index) in value.receiptHeader"
        :key="index"
      >
        <div>{{ i.title }}:</div>
        <div>{{ i.value }}</div>
      </div>
    </div>

    <v-divider />

    <div v-if="value.receiptEnums.roomRatesArray.length > 0">
      <div class="my-3 font-weight-regular">
        Dates:
        <div
          :class="{
            'text-decoration-line-through': isRefundedOrVoided(
              value.receiptEnums.roomPaymentStatus
            ),
          }"
          class="ml-5 d-flex justify-space-between align-center"
          v-for="(i, index) in value.receiptEnums.roomRatesArray"
          :key="'roomRates' + index"
        >
          <div>{{ i.date }}</div>
          <div>₱ {{ i.rate }}</div>
        </div>

        <div
          v-if="isRefundedOrVoided(value.receiptEnums.roomPaymentStatus)"
          class="text-right warning--text"
        >
          {{ value.receiptEnums.roomPaymentStatus }}
        </div>

        <div v-if="value.receiptEnums.extraPersonTotal > 0">
          Addt'l Persons Charge:
          <div
            :class="{
              'text-decoration-line-through': isRefundedOrVoided(
                value.receiptEnums.roomPaymentStatus
              ),
            }"
            class="ml-5 d-flex justify-space-between align-center"
            v-for="(i, index) in value.receiptEnums.roomRatesArray"
            :key="'roomRates' + index"
          >
            <div>{{ i.date }}</div>
            <div>₱ {{ i.extraPersonRate }}</div>
          </div>
        </div>

        <div
          v-if="
            isRefundedOrVoided(value.receiptEnums.roomPaymentStatus) &&
            value.receiptEnums.extraPersonTotal > 0
          "
          class="text-right warning--text"
        >
          {{ value.receiptEnums.roomPaymentStatus }}
        </div>

        <div v-if="value.receiptEnums.addonsArray.length > 0">
          Addons Charge:
          <div
            class="ml-5 mb-3"
            v-for="(i, index) in value.receiptEnums.addonsArray"
            :key="'addons' + index"
          >
            <div
              :class="{
                'text-decoration-line-through': isRefundedOrVoided(i),
              }"
              class="d-flex justify-space-between align-center"
            >
              <div>{{ i.name }} x {{ i.quantity }} @ ₱{{ i.unitPrice }}</div>
              <div>₱ {{ i.total }}</div>
            </div>
            <div v-if="isRefundedOrVoided(i)" class="warning--text text-right">
              {{ i.paymentStatus }}
            </div>
          </div>
        </div>
      </div>

      <v-divider />
    </div>

    <div class="my-3 font-weight-regular">
      <div class="d-flex justify-space-between align-center">
        <div>Room Total:</div>
        <div>₱ {{ value.receiptEnums.roomTotal }}</div>
      </div>

      <div class="d-flex justify-space-between align-center">
        <div>Extra Person Total:</div>
        <div>₱ {{ value.receiptEnums.extraPersonTotal }}</div>
      </div>
    </div>

    <v-divider />

    <div v-if="value.receiptEnums.addonsArray.length">
      <div
        class="d-flex justify-space-between align-center my-3 font-weight-regular"
      >
        <div>Add-ons Total:</div>
        <div>
          ₱
          {{ value.receiptEnums.addonsTotal }}
        </div>
      </div>
      <v-divider />
    </div>

    <div class="my-3 font-weight-regular">
      <div class="d-flex justify-space-between align-center">
        <div>Total:</div>
        <div>₱ {{ value.receiptEnums.total }}</div>
      </div>

      <div
        v-if="
          value.receiptEnums.discount && value.receiptEnums.discount !== '0%'
        "
      >
        <div>Discount:</div>
        <div class="d-flex justify-space-between align-center">
          <div class="font-italic ms-3">
            {{ value.receiptEnums.voucherCode }}
            {{ value.receiptEnums.discount }}
          </div>
          <div class="font-italic font-weight-bold">
            - ₱ {{ value.receiptEnums.discountedValue ?? 0 }}
          </div>
        </div>
      </div>

      <div
        class="d-flex justify-space-between align-center primary--text font-weight-bold"
      >
        <div>Total Received:</div>
        <div>₱ {{ value.clientInput.totalReceived }}</div>
      </div>
    </div>

    <v-divider />

    <div class="my-3 font-weight-bold">
      <div class="d-flex justify-space-between align-center warning--text">
        <div>Total Outstanding:</div>
        <div>₱ {{ value.clientInput.totalOutstanding }}</div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <div>Total Change:</div>
        <div>₱ {{ value.clientInput.totalChange }}</div>
      </div>
    </div>

    <v-card-actions v-if="value.button" class="pa-0">
      <v-btn
        type="submit"
        :loading="loading"
        block
        depressed
        :outlined="value.button.outlined"
        color="primary"
        class="mt-4"
        >{{ value.button.title }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "TotalBillCard",
  props: {
    value: Object,
    loading: Boolean,
  },
  data: () => ({}),
  methods: {
    isRefundedOrVoided(item) {
      const status = item?.paymentStatus ?? item;
      return status === "VOIDED" || status === "REFUNDED";
    },
  },
};
</script>
