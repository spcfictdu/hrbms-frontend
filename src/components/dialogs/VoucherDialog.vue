<template>
  <DialogTemplate
    maxWidth="450"
    :opened="opened"
    :onClose="onClose"
    :action="meta.action"
    title="Voucher"
    @onSubmit="handleProceed"
  >
    <FormField label="Voucher Code" class="mb-4">
      <v-text-field
        outlined
        dense
        hide-details="auto"
        v-model="payload.code"
        :rules="rules.code"
        type="text"
      ></v-text-field>
    </FormField>
    <FormField label="Voucher Discount Percent" class="mb-4">
      <v-text-field
        outlined
        dense
        hide-details="auto"
        v-model="payload.value"
        :rules="rules.value"
        type="number"
        hide-spin-buttons
      ></v-text-field>
    </FormField>
    <FormField label="Expiration Date" class="mb-4">
      <DateField
        :minDate="minDate"
        :model="payload.expires_at"
        :rules="rules.expires_at"
        @input="payload.expires_at = $event"
      />
    </FormField>
    <FormField label="Voucher Usage" class="mb-4">
      <v-text-field
        outlined
        dense
        hide-details="auto"
        v-model="payload.usage"
        :rules="rules.usage"
        type="number"
        hide-spin-buttons
      ></v-text-field>
    </FormField>
    <v-card-actions class="pa-0">
      <v-row dense>
        <v-col cols="12" sm="6" order="last" order-sm="first"
          ><v-btn text block color="warning" @click="handleCancel"
            >Cancel</v-btn
          ></v-col
        >
        <v-col cols="12" sm="6"
          ><v-btn
            text
            block
            color="primary"
            class="lightBg"
            :loading="loading"
            type="submit"
            >Proceed</v-btn
          ></v-col
        >
      </v-row>
    </v-card-actions>
  </DialogTemplate>
</template>

<script>
import { mapActions, mapState } from "vuex"
import FormField from "../fields/FormField.vue"
import DialogTemplate from "./DialogTemplate.vue"
import DateField from "../fields/DateField.vue"

export default {
  name: "VoucherDialog",
  components: { DialogTemplate, FormField, DateField },
  props: {
    opened: Boolean,
    onClose: Function,
    meta: Object,
    loading: Boolean,
  },
  data: () => ({
    payload: {
      code: "",
      value: null,
      expires_at: "",
      usage: null,
    },
  }),
  methods: {
    handleCancel() {
      this.onClose()
    },
    handleProceed() {
      const { usage, value } = this.payload
      const newVoucher = {
        ...this.payload,
        usage: Number(usage),
        value: Number(value),
      }

      let payload = {
        data: newVoucher,
      }
      if (this.meta?.value) {
        payload.refNum = this.meta?.value?.referenceNumber
      }
      this.$emit("onSubmit", payload)
    },
    assignPayload(v) {
      this.payload = {
        code: v.code,
        value: v.value,
        expires_at: v.expires_at,
        usage: v.usage,
      }
    },
  },
  computed: {
    rules() {
      const errors = {}
      errors.code = [(v) => !!v || "Voucher code is required"]
      errors.value = [
        (v) => !!v || "Voucher discount amount is required",
        (v) =>
          (Number(v) > 0 && Number(v) <= 100) ||
          "Voucher usage must be between 1 and 100.",
      ]
      errors.expires_at = [(v) => !!v || "Expiration date is required"]
      errors.usage = [
        (v) => !!v || "Voucher usage is required",
        (v) => Number(v) > 0 || "Voucher usage must be at least 1.",
      ]
      return errors
    },

    minDate() {
      let nextDay = new Date()
      nextDay.setDate(nextDay.getDate() + 1) // Add one day

      return nextDay.toISOString().slice(0, 10)
    },
  },
  watch: {
    meta: {
      handler(v) {
        if (v?.value) {
          this.assignPayload(v.value)
        } else {
          this.payload = {
            code: "",
            value: null,
            expires_at: "",
            usage: null,
          }
        }
      },
    },
  },
}
</script>
