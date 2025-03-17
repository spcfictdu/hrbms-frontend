<template>
  <div>
    <div class="d-flex flex-row align-start justify-space-between mb-4 mb-md-0">
      <div>
        <p class="text-h6 font-weight-bold mb-0">
          {{ room.name.toUpperCase() }}
        </p>
        <p class="text-subtitle-2 font-weight-regular">
          <PriceSlot :price="room.price" :maxOccupancy="room.maxOccupancy" />
        </p>
      </div>

      <div class="d-flex" v-if="$auth.user()?.role === 'ADMIN'">
        <v-menu left offset-x>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs" icon outlined color="primary"
              ><v-icon small>mdi-pencil</v-icon></v-btn
            >
          </template>
          <v-list dense class="py-0">
            <v-list-item
              :class="{
                'menu-border': index < menuItems.length - 1,
                'warning--text': iter.text.includes('Remove'),
              }"
              v-for="(iter, index) in menuItems"
              :key="index"
              @click="iter.action()"
            >
              <v-list-item-title class="text-body-2 font-weight-regular">{{
                iter.text
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <div>
      <p class="text-body-2 longText--text">
        {{ room.description }}
      </p>
    </div>

    <v-divider class="mt-7" />

    <InfoSection title="Amenities">
      <v-chip
        outlined
        small
        class="mr-2 mb-1 text-subtitle-2"
        v-for="(amenity, i) in room.amenities"
        :key="i"
        :color="i % 2 === 0 ? 'primary' : 'accentOne'"
        >{{ capitalizeString(amenity.name) }}</v-chip
      >
    </InfoSection>

    <v-divider />

    <InfoSection title="Price Rates">
      <template v-slot:headerItem>
        <div class="text-caption font-weight-regular">
          {{ discountDates }}
          <span class="ml-md-2">
            <v-chip small color="primary" outlined class="text-subtitle-2">{{
              discountChip
            }}</v-chip>
          </span>
        </div>
      </template>

      <PriceRatesTable
        :value="room.prices"
        @click:row="assignPromoInfo($event)"
      />
    </InfoSection>

    <RateDialog
      :opened="category_rate"
      :onClose="() => setDialogFn({ key: 'category_rate', value: false })"
      :rateMeta="rateMeta"
      :loading="loading.dialog"
      @validation-event="$emit('validation-event', $event)"
    />
    <delete-dialog
      :opened="category_delete"
      :onClose="() => setDialogFn({ key: 'category_delete', value: false })"
      :message="deleteMessage"
      :loading="category_loading.delete"
      @onDelete="$emit('delete-event')"
    />
  </div>
</template>

<script>
import PriceSlot from "../../slots/PriceSlot.vue";
import RateDialog from "@/components/dialogs/RateDialog.vue";
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue";
import InfoSection from "@/components/sections/InfoSection.vue";
import PriceRatesTable from "@/components/tables/variants/PriceRatesTable.vue";
import { mapActions, mapState } from "vuex";
import { formatDate, capitalizeString } from "@/mixins/FormattingFunctions";
export default {
  name: "RoomInfo",
  mixins: [formatDate, capitalizeString],
  props: {
    room: Object,
  },
  components: {
    PriceSlot,
    RateDialog,
    DeleteDialog,
    InfoSection,
    PriceRatesTable,
  },
  data: () => ({
    // Rate Dialog
    rateMeta: {
      action: "",
      roomType: "",
      rateType: "",
    },
    // Delete Dialog
    deleteMessage: "",
    // Miscellaneous
    discountChip: "Regular Rate",
    discountDates: "",
  }),
  methods: {
    ...mapActions("dialogs", ["setDialogFn"]),
    assignPromoInfo: function (rowData) {
      this.discountChip = rowData.rate;
      this.discountDates =
        rowData.startDate && rowData.endDate
          ? `${this.formatDate(rowData.startDate)} - ${this.formatDate(
              rowData.endDate
            )}`
          : "";
    },
    // Rate Dialog
    assignRateMeta: function (meta) {
      this.rateMeta = {
        ...this.rateMeta,
        ...meta,
      };
    },
  },
  computed: {
    ...mapState("roomRates", ["loading"]),
    ...mapState("roomCategories", {
      category_loading: "loading",
    }),
    ...mapState("dialogs", ["category_rate", "category_delete"]),
    menuItems: function () {
      return [
        {
          text: "Add special rate",
          action: () => {
            this.assignRateMeta({
              action: "ADD",
              roomType: this.room.name,
              rateType: "special",
            });
            this.setDialogFn({ key: "category_rate", value: true });
          },
        },
        {
          text: "Edit regular rate",
          action: () => {
            this.assignRateMeta({
              action: "EDIT",
              roomType: this.room.name,
              rateType: "regular",
            });
            this.setDialogFn({ key: "category_rate", value: true });
          },
        },
        {
          text: "Edit special rate",
          action: () => {
            this.assignRateMeta({
              action: "EDIT",
              roomType: this.room.name,
              rateType: "special",
            });
            this.setDialogFn({ key: "category_rate", value: true });
          },
        },
        {
          text: "Edit category",
          action: () => {
            this.$router.push({
              name: "Update Room",
              params: {
                roomCategoryReferenceNumber: this.room.referenceNumber,
              },
            });
          },
        },
        {
          text: "Remove rate",
          action: () => {
            this.assignRateMeta({
              action: "DELETE",
              roomType: this.room.name,
              rateType: "special",
            });
            this.setDialogFn({ key: "category_rate", value: true });
          },
        },
        {
          text: "Remove category",
          action: () => {
            this.deleteMessage = "category";
            this.setDialogFn({ key: "category_delete", value: true });
          },
        },
      ];
    },
  },
};
</script>

<style scoped>
.price-table {
  background-color: transparent;
  cursor: pointer;
}
.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
