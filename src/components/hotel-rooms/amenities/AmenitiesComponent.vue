<template>
  <v-row justify="start" v-if="loading">
    <v-col
      v-for="n in 20"
      :key="n"
      class="pb-3 pb-sm-2"
      cols="12"
      md="3"
      sm="4"
    >
      <v-skeleton-loader type="button" />
    </v-col>
  </v-row>

  <v-row justify="start" v-else>
    <v-col
      v-for="amenity in data"
      :key="amenity.referenceNumber"
      class="pb-3 pb-sm-2"
      cols="12"
      md="3"
      sm="4"
    >
      <v-menu
        :offset-y="isSmall"
        :offset-x="isLarge"
        :right="isLarge"
        :max-width="menuWidth"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="text-uppercase text-subtitle-2 font-weight-regular"
            depressed
            block
            :ripple="false"
            :color="selectedAmenity === amenity.name ? 'primary' : 'lightBg'"
            :class="
              selectedAmenity === amenity.name
                ? 'font-weight-medium'
                : 'font-weight-regular'
            "
            @click="setSelectedAmenity(amenity.name)"
            v-bind="attrs"
            v-on="on"
          >
            {{ amenity.name }}
          </v-btn>
        </template>
        <v-list dense class="pa-0">
          <v-list-item
            v-for="(option, index) in options"
            :key="index"
            @click="
              selectOption(option.value, amenity.referenceNumber, amenity.name)
            "
            :class="{ 'menu-border': index < options.length - 1 }"
          >
            <v-list-item-title
              class="text-subtitle-2 font-weight-regular"
              :class="itemColor(option.text)"
            >
              {{ option.text }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "AmenitiesComponent",
  props: {
    data: Array,
  },
  data: () => ({
    // Menu Options
    options: [
      {
        text: "Edit Amenity",
        value: "edit",
      },
      {
        text: "Delete Amenity",
        value: "delete",
      },
    ],

    // Menu Properties
    isSmall: false,
    isLarge: true,
    menuWidth: 150,
  }),

  methods: {
    ...mapActions("amenities", ["setSelectedAmenity", "fetchAmenities"]),
    ...mapActions("dialogs", ["setDialogMessage"]),

    itemColor: function (item) {
      if (item === "Delete Amenity") {
        return "warning--text";
      }
    },

    selectOption(option, referenceNumber, amenityName) {
      this.setDialogMessage("Amenity");
      this.$emit("onSelect", option, referenceNumber, amenityName);
    },
  },
  computed: {
    ...mapState("amenities", ["selectedAmenity"]),
    ...mapGetters("amenities", ["getLoading"]),

    loading() {
      return this.getLoading("amenities") && !this.data.length;
    },

    size() {
      return this.$vuetify.breakpoint;
    },
  },
  created() {
    this.fetchAmenities();
  },
  watch: {
    size: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (newVal.sm) {
          this.isSmall = true;
          this.isLarge = false;
          this.menuWidth = 300;
        } else if (newVal.xs) {
          this.isSmall = true;
          this.isLarge = false;
          this.menuWidth = 500;
        } else {
          this.isSmall = false;
          this.isLarge = true;
          this.menuWidth = 150;
        }
      },
    },
  },
};
</script>

<style scoped>
.menu-border {
  border-bottom: 1px solid #e6e2e2;
}

.v-skeleton-loader >>> .v-skeleton-loader__button {
  width: 100% !important;
}
</style>
