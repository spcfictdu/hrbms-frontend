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

      <PriceRatesTable :value="room.prices" @click:row="assignValues($event)" />
    </InfoSection>

    <rate-dialog
      :activator="rateDialog"
      :rateMeta="rateMeta"
      @reset-activator="resetActivator"
      @validation-event="(e) => $emit('validation-event', e)"
    />
    <delete-dialog
      :activator="deleteDialog"
      @reset-activator="resetDeleteActivator"
      :deleteMeta="deleteMeta"
      @delete-event="$emit('delete-event')"
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
export default {
  name: "RoomInfo",
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
      typeOfAction: "",
      roomType: "",
      rateType: "",
      referenceNumber: "",
      loading: false,
    },
    // Delete Dialog
    deleteDialog: false,
    deleteMeta: {
      targetDeletion: "",
      loading: false,
    },
    // Miscellaneous
    discountChip: "Regular Rate",
    discountDates: "",
  }),
  methods: {
    ...mapActions("roomRates", ["triggerDialog"]),
    ...mapActions("dialogs", ["setDialogFn"]),
    capitalizeString(str) {
      const lowerCaseString = str.toLowerCase();
      return lowerCaseString
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
    assignValues: function (rowData) {
      this.discountChip = rowData.rate;
      this.discountDates =
        rowData.startDate && rowData.endDate
          ? this.formatDate(rowData.startDate, rowData.endDate)
          : "";
    },
    formatDate(start, end) {
      const formattedDateOne = new Date(start).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedDateTwo = new Date(end).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return `${formattedDateOne} - ${formattedDateTwo}`;
    },
    // Rate Dialog
    activateDialog: function (meta) {
      this.rateMeta = {
        ...this.rateMeta,
        ...meta,
      };
      this.triggerDialog(true);
    },
    resetActivator: function () {
      this.triggerDialog(false);
    },
    // Delete Dialog
    activateDeleteDialog: function (meta) {
      this.deleteMeta = meta;
      this.deleteDialog = !this.deleteDialog;
    },
    resetDeleteActivator: function () {
      this.deleteDialog = false;
    },
  },
  computed: {
    ...mapState("roomRates", {
      rateDialog: "rateDialog",
      rateMetaState: "meta",
    }),
    menuItems: function () {
      return [
        {
          text: "Add special rate",
          action: () => {
            let meta = {
              typeOfAction: "ADD",
              roomType: this.room.name,
              rateType: "special",
            };
            this.activateDialog(meta);
          },
        },
        {
          text: "Edit regular rate",
          action: () => {
            let meta = {
              typeOfAction: "EDIT",
              roomType: this.room.name,
              rateType: "regular",
            };
            this.activateDialog(meta);
          },
        },
        {
          text: "Edit special rate",
          action: () => {
            let meta = {
              typeOfAction: "EDIT",
              roomType: this.room.name,
              rateType: "special",
            };
            this.activateDialog(meta);
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
            let meta = {
              typeOfAction: "DELETE",
              roomType: this.room.name,
              rateType: "special",
            };
            this.activateDialog(meta);
          },
        },
        {
          text: "Remove category",
          action: () => {
            let meta = {
              targetDeletion: "category",
            };
            this.activateDeleteDialog(meta);
          },
        },
      ];
    },
  },
  watch: {
    rateMetaState: {
      deep: true,
      handler: function (newVal) {
        this.rateMeta.loading = newVal.loading;
      },
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
