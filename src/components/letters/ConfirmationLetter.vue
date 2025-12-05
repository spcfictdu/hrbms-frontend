<template>
  <div
    style="
      font-family: Arial, Helvetica, sans-serif;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      color: #212529;
    "
  >
    <div style="max-width: 1200px; margin: 0 auto">
      <div
        style="
          max-width: 600px;
          border: 1px solid rgba(0, 0, 0, 0.175);
          border-radius: 5px;
          margin: 0 auto;
        "
      >
        <div style="padding: 1rem">
          <img
            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop"
            alt="hotel-room"
            style="width: 100%; height: 250px; object-fit: cover"
          />
          <h2 style="margin: 16px 0">Reservation Confirmation</h2>

          <div style="font-size: 0.9rem; margin-bottom: 16px">
            <p style="margin-top: 0">
              Thank you, your reservation at HRBMS has been confirmed.
            </p>
            <p>
              We are delighted to welcome you and look forward to your stay.
            </p>
            <p>
              Please review your reservation details below and let us know if
              you wish to make any changes or requests.
            </p>
          </div>

          <div style="margin-top: 16px">
            <table style="width: 100%; border-collapse: collapse">
              <tr>
                <td style="width: 50%; vertical-align: top; padding-right: 8px">
                  <div
                    style="
                      border: 1px solid rgba(0, 0, 0, 0.175);
                      border-radius: 5px;
                    "
                  >
                    <div
                      style="
                        padding: 1rem;
                        border-bottom: 1px solid rgba(0, 0, 0, 0.175);
                      "
                    >
                      <h4 style="margin: 0">Check-in</h4>
                    </div>
                    <div style="padding: 1rem">
                      <h3 style="margin: 0">{{ checkInDate }}</h3>
                      <div style="color: #6c757d">
                        <small>From {{ checkInTime }}</small>
                      </div>
                    </div>
                  </div>
                </td>
                <td style="width: 50%; vertical-align: top; padding-left: 8px">
                  <div
                    style="
                      border: 1px solid rgba(0, 0, 0, 0.175);
                      border-radius: 5px;
                    "
                  >
                    <div
                      style="
                        padding: 1rem;
                        border-bottom: 1px solid rgba(0, 0, 0, 0.175);
                      "
                    >
                      <h4 style="margin: 0">Check-out</h4>
                    </div>
                    <div style="padding: 1rem">
                      <h3 style="margin: 0">{{ checkOutDate }}</h3>
                      <div style="color: #6c757d">
                        <small>Until {{ checkOutTime }}</small>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 16px">
            <h3 style="margin: 0 0 12px 0">Address and Contact</h3>
            <div
              style="border: 1px solid rgba(0, 0, 0, 0.175); border-radius: 5px"
            >
              <div
                style="
                  padding: 1rem;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.175);
                "
              >
                <h4 style="margin: 0">
                  Hotel Room and Booking Management System
                </h4>
                <small
                  ><a
                    href="mailto:hrbms.spcf@gmail.com"
                    style="text-decoration: none"
                    >hrbms.spcf@gmail.com</a
                  ></small
                >
              </div>
              <div style="padding: 1rem">
                <small>
                  <p style="margin: 0">
                    HRBMS is a system developed for CHTM Students in Systems
                    Plus College Foundation.
                  </p>
                </small>
              </div>
            </div>
          </div>

          <div style="margin-top: 16px">
            <h3 style="margin: 0 0 12px 0">Reservation Details</h3>
            <div
              style="border: 1px solid rgba(0, 0, 0, 0.175); border-radius: 5px"
            >
              <div
                style="
                  padding: 1rem;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.175);
                "
              >
                <h4 style="margin: 0">Guest Details</h4>
                <small>
                  <div>{{ transaction?.guestName }}</div>
                  <div>{{ guestEmail }}</div>
                </small>
              </div>
              <div style="padding: 1rem">
                <h4 style="margin: 0">Booked on</h4>
                <p style="margin: 0 0 16px 0">
                  <small>{{ bookedOn }}</small>
                </p>
                <h4 style="margin: 0">Personal Request</h4>
                <p style="margin: 0">
                  <small
                    >Please leave a bottle of champagne on the bedside table.
                    [Sample only]</small
                  >
                </p>
              </div>
            </div>
          </div>

          <div style="margin-top: 16px">
            <h3 style="margin: 0 0 12px 0">Charges</h3>
            <div
              style="border: 1px solid rgba(0, 0, 0, 0.175); border-radius: 5px"
            >
              <div style="padding: 1rem">
                <div
                  style="
                    border-bottom: 1px solid rgba(0, 0, 0, 0.175);
                    margin-bottom: 12px;
                  "
                >
                  <h4 style="margin: 0">Booking Summary</h4>
                </div>

                <small>
                  <table style="width: 100%">
                    <tr>
                      <td
                        :style="{
                          'text-decoration': isRefundedOrVoided(
                            transaction.paymentStatus,
                          )
                            ? 'line-through'
                            : 'none',
                        }"
                      >
                        Room ({{ days }} night{{ days > 1 ? "s" : "" }})
                      </td>
                      <td
                        style="text-align: end"
                        :style="{
                          'text-decoration': isRefundedOrVoided(
                            transaction.paymentStatus,
                          )
                            ? 'line-through'
                            : 'none',
                        }"
                      >
                        {{ formatPrice(totalRoomRate) }}
                      </td>
                    </tr>
                    <!-- <tr> -->
                    <!--   <td>Extra Guest Charge</td> -->
                    <!--   <td style="text-align: end"> -->
                    <!--     {{ formatPrice(extraGuestTotal) }} -->
                    <!--   </td> -->
                    <!-- </tr> -->
                    <tr>
                      <td>Discounted</td>
                      <td style="text-align: end">
                        {{ formatPrice(discountAmount) }}
                      </td>
                    </tr>

                    <template v-if="addons && addons.length > 0">
                      <tr>
                        <td colspan="2" style="padding-top: 8px">
                          <strong>Add-ons</strong>
                        </td>
                      </tr>
                      <tr v-for="addon in addons" :key="addon.id">
                        <td
                          :style="{
                            'text-decoration': isRefundedOrVoided(
                              addon.paymentStatus,
                            )
                              ? 'line-through'
                              : 'none',
                          }"
                        >
                          &nbsp;&nbsp;{{ addon.name }}
                        </td>
                        <td
                          style="text-align: end"
                          :style="{
                            'text-decoration': isRefundedOrVoided(
                              addon.paymentStatus,
                            )
                              ? 'line-through'
                              : 'none',
                          }"
                        >
                          {{ formatPrice(addon.total) }}
                        </td>
                      </tr>
                      <tr>
                        <td><em>Add-ons Total</em></td>
                        <td style="text-align: end">
                          {{ formatPrice(addonsTotal) }}
                        </td>
                      </tr>
                    </template>

                    <tr>
                      <td><strong>Total</strong></td>
                      <td style="text-align: end">
                        <strong>{{ formatPrice(grandTotal) }}</strong>
                      </td>
                    </tr>
                  </table>
                </small>

                <div
                  style="
                    border-bottom: 1px solid rgba(0, 0, 0, 0.175);
                    margin: 12px 0;
                  "
                >
                  <h4 style="margin: 0">Payment Summary</h4>
                </div>

                <small>
                  <table style="width: 100%">
                    <tr>
                      <td>Total Received</td>
                      <td style="text-align: end">
                        {{ formatPrice(paymentReceived) }}
                      </td>
                    </tr>
                    <tr>
                      <td>Outstanding Balance</td>
                      <td style="text-align: end">
                        {{ formatPrice(balance) }}
                      </td>
                    </tr>
                  </table>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import formatPrice from "@/utils/format-price";

export default {
  name: "ConfirmationLetter",
  props: {
    transaction: { type: Object, required: true },
    guest: { type: Object, default: () => ({}) },
    days: { type: Number, default: 1 },
    addons: { type: Array, default: () => [] },
    totalRoomRate: { type: Number, default: 0 },
    extraGuestTotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    addonsTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    paymentReceived: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    guestEmail: String,
  },
  methods: {
    formatPrice,
    isRefundedOrVoided(status) {
      return status === "REFUNDED" || status === "VOIDED";
    },
  },
  computed: {
    checkInDate() {
      if (!this.transaction?.checkIn) return "";
      return format(new Date(this.transaction.checkIn), "dd MMM yyyy");
    },
    checkInTime() {
      if (!this.transaction?.checkIn) return "";
      return format(new Date(this.transaction.checkIn), "h:mm a");
    },
    checkOutDate() {
      if (!this.transaction?.checkOut) return "";
      return format(new Date(this.transaction.checkOut), "dd MMM yyyy");
    },
    checkOutTime() {
      if (!this.transaction?.checkOut) return "";
      return format(new Date(this.transaction.checkOut), "h:mm a");
    },
    bookedOn() {
      if (!this.transaction?.createdAt) return "";
      return format(new Date(this.transaction.createdAt), "dd MMM yyyy");
    },
    // maskedGuestName() {
    //   const guestName = this.transaction?.guestName;
    //   if (!guestName) return "";
    //   const names = guestName.split(" ");
    //   const mask = (text) =>
    //     text.substring(0, 1) + "*".repeat(Math.max(text.length - 1, 0));
    //   return names.map(mask).join(" ");
    // },
    // maskedEmail() {
    //   if (!this.guestEmail) return "";
    //   if (email.includes("@")) {
    //     const [local, domain] = email.split("@");
    //     const maskedLocal =
    //       local.substring(0, 1) + "*".repeat(Math.max(local.length - 1, 0));
    //     return `${maskedLocal}@${domain}`;
    //   }
    //   return email;
    // },
  },
};
</script>
