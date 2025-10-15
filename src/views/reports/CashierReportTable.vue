<template>
  <v-card flat>
    <CashierTransactionDetailsTableHeader :tableHead="tableHead" />

    <div class="px-5 pb-5">
      <DefaultTable :headers="headers" :items="items" hideDefaultFooter>
        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </DefaultTable>
    </div>
  </v-card>
</template>

<script>
import CashierTransactionDetailsTableHeader from "@/components/cashier/CashierTransactionDetailsTableHeader.vue";
import DefaultTable from "@/components/tables/DefaultTable.vue";

export default {
  name: "CashierReportTable",
  components: { CashierTransactionDetailsTableHeader, DefaultTable },
  props: { items: Array, headers: Array, tableHead: Object },
};
</script>
