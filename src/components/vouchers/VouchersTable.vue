<template>
  <div>
    <v-skeleton-loader type="table" v-if="loading" />

    <v-card flat v-else>
      <VouchersTableHeader :numberOfItems="items.length" :loaded="!loading" />
      <DefaultTable :headers="headers" :items="items">
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            small
            dark
            :color="statusColors[item.status] ?? ''"
            class="font-weight-medium"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:[`item.menu`]="{ item }">
          <v-menu offset-x bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list dense class="py-0">
              <v-list-item
                class="menu-border"
                v-for="(action, i) in actions(item)"
                :key="i"
                @click="() => action.action(item)"
              >
                <v-list-item-title
                  class="text-body-2 font-weight-regular"
                  :class="action.class"
                >
                  {{ action.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </DefaultTable>
    </v-card>
  </div>
</template>

<script>
import VouchersTableHeader from "../table-headers/VouchersTableHeader.vue"
import DefaultTable from "../tables/DefaultTable.vue"

export default {
  name: "VouchersTable",
  components: { DefaultTable, VouchersTableHeader },
  props: {
    headers: Array,
    items: Array,
    statusColors: Object,
    actions: Function,
    loading: Boolean,
  },
}
</script>
