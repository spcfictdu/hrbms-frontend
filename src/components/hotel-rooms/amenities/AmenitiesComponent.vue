<template>
  <div>
    <v-row justify="start">
      <v-col
        v-for="amenity in data"
        :key="amenity.name"
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
              :color="selectedAmenity === amenity.name ? 'primary' : 'lightBg'"
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
                selectedOption(
                  option.value,
                  amenity.referenceNumber,
                  amenity.name
                )
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
    <DeleteDialog
      :opened="amenity_delete"
      :onClose="() => setDialogFn({ key: 'amenity_delete', value: false })"
      :loading="loading.dialog"
      message="Amenity"
      @onDelete="requestAction"
    />
    <AmenityDialog
      :opened="amenity_dialog"
      :onClose="() => setDialogFn({ key: 'amenity_dialog', value: false })"
      :meta="meta"
      :loading="loading.dialog"
      @amenity-request="requestAction"
    />
  </div>
</template>

<script>
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue";
import AmenityDialog from "@/components/dialogs/AmenityDialog.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "AmenitiesComponent",
  components: { DeleteDialog, AmenityDialog },
  props: {
    data: Array,
  },
  data: () => ({
    selectedAmenity: null,
    payload: {
      requestType: null,
    },

    // Dialog Meta
    meta: {
      action: "", // Add Amenity, Edit Amenity, Delete Amenity
      value: null,
    },

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

    dialogKeys: {
      edit: "amenity_dialog",
      delete: "amenity_delete",
    },
  }),

  methods: {
    ...mapActions("amenities", []),
    ...mapActions("dialogs", ["setDialogFn"]),
    selectAmenity: function (amenity) {
      this.selectedAmenity = amenity;
    },
    itemColor: function (item) {
      if (item === "Delete Amenity") {
        return "warning--text";
      }
    },
    selectedOption: function (option, refNum, amenityName) {
      const options = {
        edit: () => {
          this.meta = {
            action: "Edit",
            value: amenityName,
          };
          this.payload = {
            refNum,
            requestType: "edit",
          };
        },
        delete: () => {
          this.meta.action = "Delete";
          this.payload = {
            refNum,
            requestType: "delete",
          };
        },
      };

      if (options[option]) {
        this.setDialogFn({ key: this.dialogKeys[option], value: true });
        options[option]();
      }
    },
    requestAction: function (requestData) {
      // Assign data to payload if action is Add or Edit
      if (["Add", "Edit"].includes(this.meta.action)) {
        this.payload.data = requestData;
      }
      this.$emit("request-event", this.payload);
      this.selectedAmenity = null;
    },
    resetMeta: function () {
      this.meta = {
        action: "",
        value: null,
      };
      this.payload = {
        requestType: null,
      };
    },
  },
  computed: {
    ...mapState("dialogs", ["amenity_dialog", "amenity_delete"]),
    ...mapState("amenities", ["loading"]),
    size() {
      return this.$vuetify.breakpoint;
    },
  },
  watch: {
    amenity_dialog: {
      deep: true,
      handler: function (v) {
        if (v) {
          // if action is an empty string, set it to Add
          if (this.meta.action === "") {
            this.meta.action = "Add";
            this.payload.requestType = "add";
          }
        } else {
          this.resetMeta();
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
