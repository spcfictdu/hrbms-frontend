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
      :activator="deleteDialog"
      :delete-meta="deleteMeta"
      @reset-activator="resetActivator"
      @delete-request="deleteRequest"
    />
    <AmenityDialog
      :activator="amenityDialogActivator"
      :addAmenity="amenityDialog"
      :selectedAmenityName="selectedAmenityName"
      @reset-activator="resetActivator"
      @update-request="updateRequest"
      @add-request="addRequest"
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
    menuHeight: 120,
    nudgeBottom: 30,
    selectedAmenity: null,
    deleteDialog: false,
    amenityDialogActivator: false,
    selectedAmenityRefNum: null,
    selectedAmenityName: "",
    options: ["Edit Amenity", "Delete Amenity"],
    deleteMeta: {
      targetDeletion: "",
    },
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
      if (option === "Delete Amenity") {
        this.deleteDialog = true;
        this.payload.refNum = selectedAmenityRefNum;
        this.deleteMeta.targetDeletion = "amenity";
      } else if (option === "Edit Amenity") {
        this.amenityDialogActivator = true;
        this.selectedAmenityRefNum = selectedAmenityRefNum;
        this.selectedAmenityName = selectedAmenityName;
      }
    },
    resetActivator: function () {
      if (this.deleteDialog === true) {
        this.deleteDialog = false;
      } else if (this.amenityDialogActivator === true) {
        this.amenityDialogActivator = false;
        this.selectedAmenityRefNum = null;
        this.$emit("close-dialog");
      }
      this.payload = {};
      this.selectedAmenity = null;
    },
    deleteRequest: function () {
      this.$emit("delete-event", this.payload.refNum);
      this.payload = {};
      this.deleteDialog = false;
      this.selectedAmenity = null;
    },
    updateRequest: function (amenityName) {
      this.payload.name = amenityName;
      this.$emit("update-event", {
        payload: this.payload,
        referenceNum: this.selectedAmenityRefNum,
      });
      this.amenityDialogActivator = false;
      this.payload = {};
      this.selectedAmenity = null;
    },
    addRequest: function (amenityName) {
      this.payload.name = amenityName;
      this.$emit("add-event", this.payload);
      this.amenityDialogActivator = false;
      this.payload = {};
      this.selectedAmenity = null;
      this.$emit("close-dialog");
    },
  },
  watch: {
    amenityDialog: {
      handler: function (value) {
        this.amenityDialogActivator = value;
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
          this.nudgeBottom = 0;
        } else if (newVal.xs) {
          this.isSmall = true;
          this.isLarge = false;
          this.menuWidth = 500;
          this.nudgeBottom = 0;
        } else {
          this.isSmall = false;
          this.isLarge = true;
          this.menuWidth = 150;
          this.nudgeBottom = 30;
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
