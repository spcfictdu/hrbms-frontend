<template>
  <div class="mt-6">
    <VouchersTable
      :headers="headers"
      :items="items"
      :statusColors="statusColors"
      :actions="getVoucherActions"
      :loading="firstLoad"
    />
    <VoucherDialog
      :opened="voucher_dialog"
      :onClose="() => handleClose('dialog')"
      :meta="meta"
      :loading="loading"
      @onSubmit="handleRequest"
    />
    <DeleteDialog
      :opened="voucher_delete"
      :onClose="() => handleClose('delete')"
      :loading="loading"
      message="voucher"
      @onDelete="() => handleRequest({ refNum: meta.refNum })"
    />
  </div>
</template>

<script>
import VouchersTable from "@/components/vouchers/VouchersTable.vue"
import VoucherDialog from "@/components/dialogs/VoucherDialog.vue"
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue"
import { format } from "date-fns"
import { mapActions, mapGetters, mapState } from "vuex"

export default {
  name: "VouchersView",
  components: { VoucherDialog, VouchersTable, DeleteDialog },
  data() {
    return {
      meta: {
        action: "add",
        value: null,
      },
      headers: [
        { text: "Code", value: "code" },
        { text: "Expiry Date", value: "expiresAt" },
        { text: "Discount", value: "discount" },
        { text: "Usage Left", value: "usage" },
        { text: "Status", value: "status" },
        { text: "", value: "menu", sortable: false, width: 50 },
      ],

      statusColors: {
        ACTIVE: "cash",
        INACTIVE: "red accent-4",
      },
    }
  },
  created() {
    this.fetchVouchers()
  },
  methods: {
    ...mapActions("dialogs", ["setDialogFn"]),
    ...mapActions("vouchers", [
      "fetchVouchers",
      "createVoucher",
      "updateVoucher",
      "deleteVoucher",
    ]),
    getVoucherActions({ status }) {
      return [
        {
          text: `Mark ${status === "ACTIVE" ? "Inactive" : "Active"}`,
          action: ({ referenceNumber }) => {
            this.meta = {
              action: "edit",
            }
            this.handleRequest({
              data: { status: status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
              refNum: referenceNumber,
            })
          },
        },
        {
          text: "Edit",
          action: ({ referenceNumber }) => {
            const voucher = this.getVoucherByReferenceNumber(referenceNumber)
            const value = {
              ...voucher,
              value: voucher.discount.slice(0, -1),
              expires_at: voucher.expiresAt.split(" ")[0],
            }
            this.meta = {
              action: "edit",
              value,
            }

            this.setDialogFn({ key: "voucher_dialog", value: true })
          },
        },
        {
          text: "Delete",
          class: "red--text",
          action: ({ referenceNumber }) => {
            this.meta = {
              action: "delete",
              refNum: referenceNumber,
            }
            this.setDialogFn({ key: "voucher_delete", value: true })
          },
        },
      ]
    },
    handleClose(action) {
      this.setDialogFn({
        key: `voucher_${action === "delete" ? "delete" : "dialog"}`,
        value: false,
      })
      this.meta = {
        action: "add",
        value: null,
      }
    },
    async handleRequest({ data, refNum }) {
      const requests = {
        add: () => this.createVoucher(data),
        delete: () => this.deleteVoucher(refNum),
        edit: () =>
          this.updateVoucher({
            refNum,
            data,
          }),
      }

      await requests[this.meta.action]()

      this.handleClose()
    },
  },
  computed: {
    ...mapState("dialogs", ["voucher_dialog", "voucher_delete"]),
    ...mapState("vouchers", ["loading", "vouchers"]),
    ...mapGetters("vouchers", ["getVoucherByReferenceNumber"]),
    items() {
      return this.vouchers.map((v) => ({
        ...v,
        expiresAt: format(new Date(v.expiresAt), "MMMM dd, yyy"),
      }))
    },
    firstLoad() {
      return this.loading && !this.vouchers?.length
    },
  },
}
</script>
