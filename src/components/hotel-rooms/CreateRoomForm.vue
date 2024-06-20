<template>
  <v-row>
    <v-col cols="12" md="5">
      <div class="room-large mb-2">
        <v-img
          class="room-images lightBg"
          height="300"
          :src="imagesUrlPath[0]"
        />
      </div>
      <div class="small-images-wrapper">
        <v-img
          class="room-images room-small lightBg"
          height="100"
          :src="imagesUrlPath[1]"
        />
        <v-img
          class="room-images room-small lightBg"
          height="100"
          :src="imagesUrlPath[2]"
        />
        <v-img
          class="room-images room-small lightBg"
          height="100"
          :src="imagesUrlPath[3]"
        />
      </div>
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
export default {
  name: "CreateRoomForm",
  components: { LabelSlot, TitleSlot },
  props: {
    filledCategory: Object,
    meta: Object,
  },
  data: () => ({
    imagesUrl: [],

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
      this.uploads = files;
      this.imagesUrl = files.map((key) => URL.createObjectURL(key));
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
            balconyOrTerrace: balconyOrTerrace,
            amenities: {
              delete: this.amenityMutation(amenities).deleted,
              add: this.amenityMutation(amenities).added,
            },
            images: {
              delete: [],
              add: [], // Files
            },
          };
          console.log(payload);
        }
        // this.$emit("validation-event", payload);
      }
    },
    assignCategoryValues: function (newVal) {
      this.category = newVal.name;
      this.description = newVal.description;
      this.bedSize = newVal.bedSize;
      this.propertySize = newVal.propertySize;
      this.maxOccupancy = newVal.capacity;
      this.nonSmoking = newVal.IsNonSmoking;
      this.balconyOrTerrace = newVal.balconyOrTerrace;
      this.amenities = newVal.amenities;
      this.imagesUrl = newVal.images;
      this.images = newVal.images;
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
  },
  computed: {
    ...mapState("amenities", {
      amenitiesEnum: "amenities",
    }),
    imagesUrlPath: function () {
      return this.meta.status === "NEW"
        ? this.imagesUrl
        : this.imagesUrl.map((key) => `${this.$apiPath}/${key}`);
    },
    rules: function () {
      let errors = {};
      errors.name = [(v) => !!v || "Category name is required"];
      errors.description = [(v) => !!v || "Description is required"];
      errors.maxOccupancy = [(v) => !!v || "Maximum occupancy is required"];
      errors.bedSize = [(v) => !!v || "Bed size is required"];
      errors.propertySize = [(v) => !!v || "Property size is required"];
      errors.amenities = [(v) => !!v.length > 0 || "Amenities is required"];
      errors.images = [
        (v) => !!v || "Images is required",
        (v) => (v && v.length === 4) || "Four images are required",
      ];
      errors.rate = [(v) => !!v || "Required"];
      return errors;
    },
  },
  watch: {
    filledCategory: {
      handler: function (newVal) {
        this.assignCategoryValues(newVal);
      },
    },
  },
  created() {
    this.fetchAmenities();
  },
};
</script>

<style scoped>
.room-images {
  border-radius: 3px;
}

.small-images-wrapper {
  width: 100%;
  display: grid;
  column-gap: 0.5rem;
  grid-template-columns: repeat(3, 1fr);
}

.room-large {
  min-height: 300px;
}

.room-small {
  min-height: 100px;
}
</style>
