<template>
  <FormSection title="Booking Summary" class="pb-8">
    <TotalBillCard v-if="room" :value="bookingSummary" :loading="loading" />
    <TotalBillCardSkeleton v-else />
  </FormSection>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import TotalBillCard from "../hotel-rooms/forms/TotalBillCard.vue";
import FormSection from "../sections/FormSection.vue";
import TotalBillCardSkeleton from "../skeleton-loaders/TotalBillCardSkeleton.vue";

export default {
	name: "BookingSummary",
	components: {
		TotalBillCard,
		FormSection,
		TotalBillCardSkeleton,
	},
	props: {
		loading: Boolean,
		clientMeta: Object,
		queryParams: Object,
		btnStyling: Object,
		secondaryBtn: Object,
	},
	data: () => ({}),

	methods: {
		...mapActions("roomEnum", ["fetchRoom"]),
		...mapMutations("roomEnum", ["SET_ROOM"]),
	},
	computed: {
		...mapState("addonsEnum", ["addons"]),
		...mapState("roomEnum", ["room"]),
		...mapState("vouchers", ["activeVoucher"]),

		bookingSummary: function () {
			const room = this.room ? this.room[0] : null;

			if (!room) return;

			const data = [
				{
					title: "Guest Name",
					value: this.clientMeta.clientName,
				},
			];

			if (
				["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"].includes(
					this.clientMeta.status,
				)
			) {
				data.push(
					{
						title: "Room",
						value: room.roomNumber,
					},
					{
						title: "Floor",
						value: `Floor ${room.roomFloor}`,
					},
				);
			}

			const roundToTwoDecimal = (val) => Math.round(val * 100) / 100;

			const isRoomRefundedOrVoided = () =>
				this.queryParams.roomPaymentStatus === "REFUNDED" ||
				this.queryParams.roomPaymentStatus === "VOIDED";

			const roomTotal = isRoomRefundedOrVoided()
				? 0
				: room.roomRatesArray.reduce((total, room) => total + room.rate, 0);

			const extraPersonTotal = isRoomRefundedOrVoided()
				? 0
				: room.roomRatesArray.reduce(
						(total, room) => total + room.extraPersonRate,
						0,
					);

			const totalWithoutAddons = roomTotal + extraPersonTotal;

			const existingAddons = this.queryParams?.addons
				? this.queryParams.addons.filter((a) => a.addonId)
				: [];
			const newAddons = this.queryParams?.addons
				? this.queryParams.addons.filter((a) => !a.addonId)
				: [];
			const mockedNewAddons = newAddons.reduce((addons, prev) => {
				const addonDetails = this.addons.find((a) => a.name === prev.name);

				if (!addonDetails) return addons;

				const unitPrice = addonDetails.price;
				const total = roundToTwoDecimal(
					Number(unitPrice) * Number(prev.quantity),
				);
				const addon = {
					...prev,
					unitPrice,
					total,
					createdAt: new Date().toISOString(),
				};
				return [...addons, addon];
			}, []);
			const addonsArray = [...existingAddons, ...mockedNewAddons];
			const hasPendingAddon = addonsArray.some(
				(addon) => addon.paymentStatus === "PENDING",
			);

			const validAddons = addonsArray.filter(
				(a) => a.paymentStatus !== "REFUNDED" && a.paymentStatus !== "VOIDED",
			);

			const addonsTotal = roundToTwoDecimal(
				validAddons.reduce((total, prev) => total + prev.total, 0),
			);

			const batchedAddons = addonsArray.reduce((acc, addon) => {
				const { purchaseBatch } = addon;
				if (!acc[purchaseBatch]) acc[purchaseBatch] = [];
				acc[purchaseBatch].push(addon);
				return acc;
			}, {});

			const batchedAddonsArray = Object.values(batchedAddons);

			// Total Bill
			const total = roundToTwoDecimal(totalWithoutAddons + addonsTotal);

			// Total Received
			const totalReceived = this.clientMeta.amountReceived;

			const discountedValue = roundToTwoDecimal(room.discountedAmount);

			// Total Outstanding Bill
			const calculatedOutstanding = roundToTwoDecimal(
				total - totalReceived - discountedValue,
			);
			const totalOutstanding = roundToTwoDecimal(
				calculatedOutstanding < 0 ? 0 : calculatedOutstanding,
			);

			// Total Change
			const totalChange = roundToTwoDecimal(
				totalReceived > total ? totalReceived - total : 0,
			);

			const summary = {
				receiptHeader: data,
				receiptEnums: {
					type: room.roomType,
					roomNumber: room.roomNumber,
					capacity: room.roomTypeCapacity,
					roomFloor: room.roomFloor,
					roomPaymentStatus: this.queryParams.roomPaymentStatus,
					roomTotal,
					extraPersonTotal,
					total,
					roomRatesArray: room.roomRatesArray,
					addons: batchedAddonsArray,
					hasPendingAddon,
					// addonsArray,
					discount: room.discount,
					discountedValue,
					addonsTotal,
				},
				clientInput: {
					totalReceived: totalReceived,
					totalOutstanding: totalOutstanding,
					totalChange:
						calculatedOutstanding < 0
							? Math.abs(calculatedOutstanding)
							: totalChange,
				},
				button: this.btnStyling,
				secondaryBtn: this.secondaryBtn,
			};

			if (this.queryParams.voucherCode) {
				summary.receiptEnums.voucherCode =
					this.activeVoucher?.code ?? this.queryParams.voucherCode;
			}

			return summary;
		},
	},
	beforeDestroy() {
		this.SET_ROOM(null);
	},
	watch: {
		queryParams: {
			immediate: true,
			deep: true,
			handler: async function (v) {
				const data = {
					...v,
					...(v.addons && {
						addons: v.addons
							.filter(({ name }) => name)
							.map(({ name, quantity }) => `${name}-${quantity}`),
					}),
				};

				if (!data.addons) {
					this.$delete(data, "addons");
				}

				if (!data.discount) this.$delete(data, "discount");
				if (!data.voucherCode) this.$delete(data, "voucherCode");

				await this.fetchRoom(data);

				if (!this.room) return;
				// Needed by the Parent Component
				this.$emit("capacity", this.room[0].extraPersonCapacity || [0]);
				this.$emit("totalPayment", this.room[0].roomTotalWithExtraPerson);
			},
		},
	},
};
</script>

<style scoped></style>
