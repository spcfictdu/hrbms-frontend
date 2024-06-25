<template>
  <v-row>
    <v-col cols="12" md="5">
      <room-category-images
        :images="imagesUrl"
        @delete-images-event="handleImageDeletion"
        :deletedImage="deletedImage"
      />
    </v-col>
    <v-col cols="12" md="7">
      <v-form lazy-validation ref="form">
        <div class="d-flex align-start justify-space-between mb-4 mb-md-0">
          <div>
            <p class="text-h6 font-weight-bold">
              {{ meta.status }} ROOM CATEGORY
            </p>
          </div>

          <div class="d-none d-md-flex">
            <v-btn color="primary" elevation="0" @click="requestRoomUpdate"
              >Save</v-btn
            >
          </div>
        </div>

        <v-row>
          <v-col cols="12">
            <label-slot>
              <template v-slot:label>Category</template>
            </label-slot>
            <v-text-field
              :rules="rules.name"
              v-model="category"
              dense
              hide-details="auto"
              outlined
              required
            />
          </v-col>

          <v-col cols="12">
            <label-slot>
              <template v-slot:label> Description </template>
            </label-slot>
            <v-textarea
              :rules="rules.description"
              v-model="description"
              rows="3"
              hide-details="auto"
              dense
              outlined
            >
            </v-textarea>
          </v-col>

          <v-col cols="12" sm="4">
            <label-slot>
              <template v-slot:label>Maximum Occupancy</template>
            </label-slot>
            <v-text-field
              v-model.number="maxOccupancy"
              type="number"
              dense
              hide-details="auto"
              :rules="rules.maxOccupancy"
              outlined
              required
            />
          </v-col>

          <v-col cols="12" sm="4">
            <label-slot>
              <template v-slot:label>Bed Size</template>
            </label-slot>
            <v-text-field
              v-model="bedSize"
              dense
              hide-details="auto"
              :rules="rules.bedSize"
              outlined
              required
            />
          </v-col>

          <v-col cols="12" sm="4">
            <label-slot>
              <template v-slot:label>Property Size</template>
            </label-slot>
            <v-text-field
              v-model="propertySize"
              dense
              hide-details="auto"
              :rules="rules.propertySize"
              outlined
              required
            />
          </v-col>

          <v-col cols="12">
            <v-divider />
            <title-slot>
              <template v-slot:title>Inclusions</template>
            </title-slot>

            <v-row align="center">
              <v-col cols="auto">
                <v-checkbox
                  :ripple="false"
                  v-model="nonSmoking"
                  label="Non-Smoking"
                  hide-details="auto"
                  dense
                ></v-checkbox>
              </v-col>
              <v-col cols="auto">
                <v-checkbox
                  :ripple="false"
                  v-model="balconyOrTerrace"
                  label="Balcony or Terrace Included"
                  hide-details="auto"
                  dense
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <label-slot>
              <template v-slot:label>Amenities</template>
            </label-slot>
            <v-autocomplete
              :items="amenitiesEnum"
              v-model="amenities"
              item-text="name"
              multiple
              hide-details="auto"
              :rules="rules.amenities"
              outlined
              dense
              small-chips
              deletable-chips
            />
          </v-col>

          <v-col cols="12">
            <label-slot>
              <template v-slot:label>Images</template>
            </label-slot>
            <v-file-input
              multiple
              small-chips
              truncate-length="15"
              hide-details="auto"
              :rules="rules.images"
              outlined
              dense
              accept="image/*"
              @change="handleImageUpload"
              :disabled="images.length === 4"
              persistent-hint
              :hint="
                images.length > 0
                  ? `Total Uploaded Files: ${images.length}`
                  : ''
              "
            />
          </v-col>

          <v-col cols="12" v-if="meta.status === 'NEW'">
            <v-divider />
            <title-slot>
              <template v-slot:title>Pricing</template>
            </title-slot>
            <div>
              <v-row>
                <v-col
                  cols="12"
                  sm="3"
                  md=""
                  v-for="(iter, index) in rates"
                  :key="index"
                >
                  <label-slot>
                    <template v-slot:label>{{ iter.day }}</template>
                  </label-slot>
                  <v-text-field
                    type="number"
                    dense
                    hide-details="auto"
                    outlined
                    :rules="rules.rate"
                    v-model.number="iter.rate"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col cols="12" class="d-flex d-md-none">
            <v-btn
              block
              color="primary"
              elevation="0"
              @click="requestRoomUpdate"
              >Save</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
import TitleSlot from "../slots/TitleSlot.vue";
import { mapActions, mapState } from "vuex";
import RoomCategoryImages from "./categories/RoomCategoryImages.vue";
export default {
  name: "CreateRoomForm",
  components: { LabelSlot, TitleSlot, RoomCategoryImages },
  props: {
    filledCategory: Object,
    meta: Object,
  },
  data: () => ({
    // Meta
    imagesUrl: [
      {
        name: "Image 1",
        file: null,
        url: "",
        old: null,
      },
      {
        name: "Image 2",
        file: null,
        url: "",
        old: null,
      },
      {
        name: "Image 3",
        file: null,
        url: "",
        old: null,
      },
      {
        name: "Image 4",
        file: null,
        url: "",
        old: null,
      },
    ],
    deletedImage: null,
    englishNumbers: {
      1: "One",
      2: "Two",
      3: "Three",
      4: "Four",
    },

    // Local Payload
    category: null,
    description: null,
    maxOccupancy: null,
    bedSize: null,
    propertySize: null,
    nonSmoking: false,
    balconyOrTerrace: false,
    amenities: [],
    images: [],
    rates: [
      {
        day: "Sunday",
        rate: null,
      },
      {
        day: "Monday",
        rate: null,
      },
      {
        day: "Tuesday",
        rate: null,
      },
      {
        day: "Wednesday",
        rate: null,
      },
      {
        day: "Thursday",
        rate: null,
      },
      {
        day: "Friday",
        rate: null,
      },
      {
        day: "Saturday",
        rate: null,
      },
    ],
  }),
  methods: {
    ...mapActions("amenities", ["fetchAmenities"]),
    handleImageUpload: function (files) {
      if (files.length > 0) {
        // Push new item
        files.forEach((item) => {
          this.images.push(item);
        });

        const emptyVal = this.imagesUrl.filter((item) => item.url === "");
        if (emptyVal) {
          emptyVal.forEach((item, index) => {
            item.file = files[index];
            item.url = URL.createObjectURL(files[index]);
          });
        }
      }
    },
    requestRoomUpdate: function () {
      const category = this.category;
      const description = this.description;
      const maxOccupancy = this.maxOccupancy;
      const bedSize = this.bedSize;
      const propertySize = this.propertySize;
      const nonSmoking = this.nonSmoking;
      const balconyOrTerrace = this.balconyOrTerrace;
      const amenities = this.amenities;
      const images = this.images;
      const rates = this.rates;

      let payload = {};
      const meta = this.meta;

      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        if (meta.status === "NEW") {
          payload = {
            name: category,
            description: description,
            bedSize: bedSize,
            propertySize: propertySize,
            capacity: maxOccupancy,
            isNonSmoking: nonSmoking,
            balconyOrTerrace: balconyOrTerrace,
            amenities: amenities,
            rates: this.reassignRateTypes(rates),
            images: images,
          };
        } else if (meta.status === "UPDATE") {
          payload = {
            name: category,
            description: description,
            bedSize: bedSize,
            propertySize: propertySize,
            capacity: maxOccupancy,
            isNonSmoking: nonSmoking,
            balconyOrTerrace: balconyOrTerrace ? 1 : 0,
            amenities: {
              delete: this.amenityMutation(amenities).deleted,
              add: this.amenityMutation(amenities).added,
            },
            images: {
              delete: this.imageMutation(images).deleted,
              add: this.imageMutation(images).added,
              update: this.imageMutation(images).updated,
            },
          };
          console.log(payload);
        }

        const formData = new FormData();

        function appendFormData(formData, key, value) {
          if (Array.isArray(value)) {
            if (value.length === 0) {
              formData.append(key, JSON.stringify([]));
            } else {
              value.forEach((item, index) => {
                appendFormData(formData, `${key}[${index}]`, item);
              });
            }
          } else if (typeof value === "object" && !(value instanceof File)) {
            if (Object.keys(value).length === 0) {
              formData.append(key, JSON.stringify({}));
            } else {
              for (const subKey in value) {
                appendFormData(formData, `${key}[${subKey}]`, value[subKey]);
              }
            }
          } else {
            formData.append(key, value);
          }
        }

        for (const key in payload) {
          if (payload.hasOwnProperty(key)) {
            appendFormData(formData, key, payload[key]);
          }
        }

        this.$emit("validation-event", formData);
      }
    },
    assignCategoryValues: function (newVal) {
      if (this.meta.status === "UPDATE") {
        this.category = newVal.name;
        this.description = newVal.description;
        this.bedSize = newVal.bedSize;
        this.propertySize = newVal.propertySize;
        this.maxOccupancy = newVal.capacity;
        this.nonSmoking = newVal.isNonSmoking;
        this.balconyOrTerrace = newVal.balconyOrTerrace;
        this.amenities = newVal.amenities;
        this.images = newVal.images;
        this.imagesUrl.forEach((item, index) => {
          item.url = `${this.$apiPath}/${newVal.images[index]}`;
          item.old = newVal.images[index];
        });
      } else if (this.meta.status === "NEW") {
        this.category = null;
        this.description = null;
        this.bedSize = null;
        this.propertySize = null;
        this.maxOccupancy = null;
        this.nonSmoking = false;
        this.balconyOrTerrace = false;
        this.amenities = [];
        this.images = [];
        this.imagesUrl.forEach((item) => {
          item.url = "";
          item.file = null;
        });
      }
    },
    reassignRateTypes: function () {
      let newVal = {};
      this.rates.forEach((key) => {
        switch (key.day) {
          case "Sunday":
            newVal.sunday = key.rate;
            break;
          case "Monday":
            newVal.monday = key.rate;
            break;
          case "Tuesday":
            newVal.tuesday = key.rate;
            break;
          case "Wednesday":
            newVal.wednesday = key.rate;
            break;
          case "Thursday":
            newVal.thursday = key.rate;
            break;
          case "Friday":
            newVal.friday = key.rate;
            break;
          case "Saturday":
            newVal.saturday = key.rate;
            break;
        }
      });
      return newVal;
    },
    amenityMutation: function (amenities) {
      const oldVal = this.filledCategory.amenities;
      const added = amenities.filter((item) => !oldVal.includes(item));
      const deleted = oldVal.filter((item) => !amenities.includes(item));
      return {
        added: added,
        deleted: deleted,
      };
    },
    imageMutation: function (images) {
      const oldVal = this.filledCategory.images;
      const added = images.filter((item) => !oldVal.includes(item));
      const deleted = oldVal.filter((item) => !images.includes(item));
      const updated = this.imagesUrl
        .filter((item) => item.file)
        .map((item) => {
          return {
            old: item.old,
            new: item.file,
          };
        });
      return {
        added: added,
        deleted: deleted,
        updated: updated,
      };
    },
    handleImageDeletion: function (newVal) {
      const formattedVal = this.imagesUrl.filter((item) =>
        newVal.includes(item.name)
      );

      formattedVal.forEach((item) => {
        this.images = this.images.filter(
          (item_file) => item.file !== item_file
        );
        this.images = this.images.filter(
          (item_file) => item.url.replace(`${this.$apiPath}/`, "") !== item_file
        );

        item.url = "";
        item.file = null;
        this.deletedImage = item.name;
      });
    },
  },
  computed: {
    ...mapState("amenities", {
      amenitiesEnum: "amenities",
    }),
    rules: function () {
      let errors = {};
      errors.name = [(v) => !!v || "Category name is required"];
      errors.description = [(v) => !!v || "Description is required"];
      errors.maxOccupancy = [(v) => !!v || "Maximum occupancy is required"];
      errors.bedSize = [(v) => !!v || "Bed size is required"];
      errors.propertySize = [(v) => !!v || "Property size is required"];
      errors.amenities = [(v) => !!v.length > 0 || "Amenities is required"];
      errors.images = [
        (_) =>
          this.images.length === 4 ||
          `${this.englishNumbers[4 - this.images.length]} ${
            4 - this.images.length <= 1 ? "image is" : "images are"
          } required`,
      ];
      errors.rate = [(v) => !!v || "Required"];
      return errors;
    },
  },
  watch: {
    filledCategory: {
      handler: function (newVal) {
        if (newVal) {
          this.assignCategoryValues(newVal);
        }
      },
    },
  },
  created() {
    this.fetchAmenities();
  },
};
</script>

<style scoped></style>
