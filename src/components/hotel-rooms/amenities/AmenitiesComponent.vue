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
          rounded
          :max-width="menuWidth"
          :nudge-bottom="nudgeBottom"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="capitalizeText text-subtitle-2 font-weight-regular"
              depressed
              block
              :color="
                selectedAmenity === amenity.name ? 'accentTwo' : 'lightBg'
              "
              :class="
                selectedAmenity === amenity.name
                  ? 'font-weight-bold'
                  : 'font-weight-regular'
              "
              @click="selectAmenity(amenity.name)"
              v-bind="attrs"
              v-on="on"
            >
              {{ amenity.name }}
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group>
              <v-list-item v-for="(option, index) in options" :key="index">
                <v-list-item-content
                  class="pa-0"
                  :class="index < options.length - 1 ? 'mt-2' : 'mt-0'"
                >
                  <v-list-item-title
                    class="text-subtitle-2"
                    :class="itemColor(option)"
                    @click="selectedOption(option, amenity.referenceNumber)"
                  >
                    {{ option }}
                  </v-list-item-title>
                  <v-divider v-if="index < options.length - 1" class="mt-3" />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <DeleteDialog
      :activator="deleteDialog"
      @reset-activator="resetActivator"
      @delete-request="deleteRequest"
    />
    <EditAmenityDialog
      :activator="editDialog"
      @reset-activator="resetActivator"
      @update-request="updateRequest"
    />
  </div>
</template>

<script>
import DeleteDialog from '@/components/dialogs/DeleteDialog.vue';
import EditAmenityDialog from '@/components/dialogs/EditAmenityDialog.vue';

export default {
  name: "AmenitiesComponent",
  components: { DeleteDialog, EditAmenityDialog },
  props: {
    amenities: {
      type: Array,
      required: true,
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
    editDialog: false,
    selectedAmenityRefNum: null,
    options: ["Edit Amenity", "Delete Amenity"],
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
    selectedOption: function (option, selectedAmenityRefNum) {
      if (option === "Delete Amenity") {
        this.deleteDialog = true;
        this.payload.refNum = selectedAmenityRefNum;
      } else if (option === "Edit Amenity") {
        this.editDialog = true;
        this.selectedAmenityRefNum = selectedAmenityRefNum;
      }
    },
    resetActivator: function () {
      if (this.deleteDialog === true) {
        this.deleteDialog = false;
      } else if (this.editDialog === true) {
        this.editDialog = false;
        this.selectedAmenityRefNum = null;
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
      this.editDialog = false;
      this.payload = {};
      this.selectedAmenity = null;
    },
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
</style>
