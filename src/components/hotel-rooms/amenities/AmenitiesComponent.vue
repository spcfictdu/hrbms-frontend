<template>
  <div>
    <v-row justify="start">
      <v-col
        v-for="(amenity, index) in amenities"
        :key="index"
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
              class="capitalizeText text-subtitle-2 font-weight-regular"
              depressed
              block
              :ripple="false"
              :color="
                selectedAmenity === amenity.name ? 'primary' : 'lightBg'
              "
              :class="
                selectedAmenity === amenity.name
                  ? 'font-weight-medium'
                  : 'font-weight-regular'
              "
              @click="selectAmenity(amenity.name)"
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
                selectedOption(option, amenity.referenceNumber, amenity.name)
              "
              :class="{ 'menu-border': index < options.length - 1 }"
            >
              <v-list-item-title
                class="text-subtitle-2 font-weight-regular"
                :class="itemColor(option)"
              >
                {{ option }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <DeleteDialog
      :activator="metaDialog.deleteActivator"
      :delete-meta="metaDialog"
      @reset-activator="resetActivator"
      @delete-event="requestAction"
    />
    <AmenityDialog
      :activator="metaDialog.amenityDialogActivator"
      :metaDialog="metaDialog"
      @reset-activator="resetActivator"
      @amenity-request="requestAction"
    />
  </div>
</template>

<script>
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue";
import AmenityDialog from "@/components/dialogs/AmenityDialog.vue";

export default {
  name: "AmenitiesComponent",
  components: { DeleteDialog, AmenityDialog },
  props: {
    amenities: {
      type: Array,
      required: true,
    },
    amenityDialog: {
      type: Boolean,
    },
  },
  data: () => ({
    payload: {},
    isSmall: false,
    isLarge: true,
    menuWidth: 150,
    selectedAmenity: null,
    options: ["Edit Amenity", "Delete Amenity"],
    metaDialog: {},
  }),
  computed: {
    size() {
      return this.$vuetify.breakpoint;
    },
  },
  methods: {
    selectAmenity: function (amenity) {
      this.selectedAmenity = amenity;
    },
    itemColor: function (item) {
      if (item === "Delete Amenity") {
        return "warning--text";
      }
    },
    selectedOption: function (
      option,
      selectedAmenityRefNum,
      selectedAmenityName
    ) {
      switch (option) {
        case "Delete Amenity":
          this.metaDialog = {
            deleteActivator: true,
            targetDeletion: "amenity",
          };
          this.payload = {
            refNum: selectedAmenityRefNum,
            requestType: "Delete Amenity",
          };
          break;
        case "Edit Amenity":
          this.metaDialog = {
            action: "Edit Amenity",
            amenityDialogActivator: true,
            amenityName: selectedAmenityName,
          };
          this.payload = {
            refNum: selectedAmenityRefNum,
            requestType: "Edit Amenity",
          };
          break;
      }
    },
    resetActivator: function () {
      if (this.metaDialog.action === "Add Amenity") {
        this.$emit("close-dialog");
      }
      this.metaDialog = {};
    },
    requestAction: function (requestData) {
      if (this.metaDialog.action === "Add Amenity" || this.metaDialog.action === "Edit Amenity") {
        this.payload.data = requestData
      }
      this.$emit("request-event", this.payload);
      this.resetActivator();
    },
  },
  watch: {
    amenityDialog: {
      handler: function (value) {
        if (value) {
          this.metaDialog = {
            action: "Add Amenity",
            amenityDialogActivator: true,
          };
          this.payload = {
            requestType: "Add Amenity",
          };
        }
      },
    },
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
.capitalizeText {
  text-transform: capitalize;
}

.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
