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
      <v-form lazy-validation ref="form" @submit.prevent="handleSubmit">
        <div class="d-flex align-start justify-space-between mb-4 mb-md-0">
          <div>
            <p class="text-h6 font-weight-bold">{{ action }} ROOM CATEGORY</p>
          </div>

          <div class="d-none d-md-flex">
            <v-btn color="primary" depressed type="submit" :loading="loading"
              >Save</v-btn
            >
          </div>
        </div>

        <v-row>
          <v-col cols="12">
            <FormField label="Category">
              <v-text-field
                :rules="rules.name"
                v-model="payload.name"
                dense
                hide-details="auto"
                outlined
                required
              />
            </FormField>
          </v-col>

          <v-col cols="12">
            <FormField label="Description">
              <v-textarea
                :rules="rules.description"
                v-model="payload.description"
                rows="3"
                hide-details="auto"
                dense
                outlined
              />
            </FormField>
          </v-col>

          <v-col cols="12" sm="4">
            <FormField label="Max Occupancy">
              <v-text-field
                v-model.number="payload.capacity"
                type="number"
                dense
                hide-details="auto"
                :rules="rules.capacity"
                outlined
                required
              />
            </FormField>
          </v-col>

          <v-col cols="12" sm="4">
            <FormField label="Bed Size">
              <v-text-field
                v-model="payload.bedSize"
                dense
                hide-details="auto"
                :rules="rules.bedSize"
                outlined
                required
              />
            </FormField>
          </v-col>

          <v-col cols="12" sm="4">
            <FormField label="Property Size">
              <v-text-field
                v-model="payload.propertySize"
                dense
                hide-details="auto"
                :rules="rules.propertySize"
                outlined
                required
              />
            </FormField>
          </v-col>

          <v-col cols="12">
            <v-divider />
            <FormSection title="Inclusions" paddingBottom="pb-0">
              <v-row align="center" class="mb-4">
                <v-col cols="auto">
                  <v-checkbox
                    :ripple="false"
                    v-model="payload.isNonSmoking"
                    label="Non-Smoking"
                    hide-details="auto"
                    dense
                  ></v-checkbox>
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    :ripple="false"
                    v-model="payload.balconyOrTerrace"
                    label="Balcony or Terrace Included"
                    hide-details="auto"
                    dense
                  ></v-checkbox>
                </v-col>
              </v-row>

              <AmenityField
                class="mb-4"
                fetchAction="amenities"
                :value="payload.amenities"
                @onInput="(v) => evaluateValue('amenities', v)"
              />

              <FormField label="Images">
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
              </FormField>
            </FormSection>
          </v-col>

          <v-col cols="12" v-if="action === 'NEW'">
            <v-divider />
            <FormSection title="Pricing" paddingBottom="pb-0">
              <v-row>
                <v-col
                  cols="12"
                  sm="3"
                  md=""
                  v-for="(iter, index) in payload.rates"
                  :key="index"
                >
                  <FormField :label="iter.day">
                    <v-text-field
                      type="number"
                      dense
                      hide-details="auto"
                      outlined
                      :rules="rules.rate"
                      v-model.number="iter.rate"
                    />
                  </FormField>
                </v-col>
              </v-row>
            </FormSection>
          </v-col>

          <v-col cols="12" class="d-flex d-md-none">
            <v-btn
              block
              color="primary"
              depressed
              :loading="loading"
              type="submit"
              >Save</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import RoomCategoryImages from "./categories/RoomCategoryImages.vue";
import FormField from "../fields/FormField.vue";
import FormSection from "../sections/FormSection.vue";
import AmenityField from "../fields/AmenityField.vue";
import { assignFormData } from "@/mixins/FormattingFunctions";
export default {
  name: "CreateRoomForm",
  mixins: [assignFormData],
  components: {
    RoomCategoryImages,
    FormField,
    FormSection,
    AmenityField,
  },
  props: {
    filledCategory: Object,
    action: String,
    loading: Boolean,
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
    payload: {
      name: null,
      description: null,
      capacity: null,
      bedSize: null,
      propertySize: null,
      isNonSmoking: false,
      balconyOrTerrace: false,
      amenities: [],
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
    },
    images: [],
  }),
  methods: {
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
    handleSubmit: function () {
      let payload = {
        ...this.payload,
      };
      const images = this.images;

      if (this.$refs.form.validate()) {
        if (this.action === "NEW") {
          payload.rates = this.ratesReducer(this.payload.rates);
          payload.images = images;
        } else if (this.action === "UPDATE") {
          payload.images = {
            delete: this.imageMutation(images).deleted,
            add: this.imageMutation(images).added,
            update: this.imageMutation(images).updated,
          };
          delete payload.rates;
        }
        const formData = this.assignFormData(payload);
        this.$emit("validation-event", formData);
      }
    },
    assignCategoryValues: function (newVal) {
      if (this.action === "UPDATE") {
        this.payload = {
          name: newVal.name,
          description: newVal.description,
          bedSize: newVal.bedSize,
          propertySize: newVal.propertySize,
          capacity: newVal.capacity,
          isNonSmoking: newVal.isNonSmoking,
          balconyOrTerrace: newVal.balconyOrTerrace,
          amenities: newVal.amenities,
        };
        this.images = newVal.images;
        this.imagesUrl.forEach((item, index) => {
          item.url = `${this.$apiPath}/${newVal.images[index]}`;
          item.old = newVal.images[index];
        });
      } else if (this.action === "NEW") {
        this.payload = {
          name: null,
          description: null,
          bedSize: null,
          propertySize: null,
          capacity: null,
          isNonSmoking: false,
          balconyOrTerrace: false,
          amenities: [],
          rates: this.payload.rates.map(({ day }) => ({ day, rate: null })),
        };
        this.images = [];
        this.imagesUrl = this.imagesUrl.map(() => ({
          url: "",
          file: null,
        }));
      }
    },
    ratesReducer: function (rates) {
      return rates.reduce((acc, { day, rate }) => {
        acc[day.toLowerCase()] = rate;
        return acc;
      }, {});
    },
    // amenityMutation: function (amenities) {
    //   const oldVal = this.filledCategory.amenities;
    //   const added = amenities.filter((item) => !oldVal.includes(item));
    //   const deleted = oldVal.filter((item) => !amenities.includes(item));
    //   return {
    //     added: added,
    //     deleted: deleted,
    //   };
    // },
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
    evaluateValue: function (key, value) {
      this.payload[key] = value;
    },
  },
  computed: {
    rules: function () {
      let errors = {};
      errors.name = [(v) => !!v || "Category name is required"];
      errors.description = [(v) => !!v || "Description is required"];
      errors.capacity = [(v) => !!v || "Capacity is required"];
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
};
</script>

<style scoped></style>
