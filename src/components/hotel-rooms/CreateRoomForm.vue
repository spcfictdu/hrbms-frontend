<template>
  <v-row>
    <v-col cols="12" md="5">
      <div class="room-large mb-2">
        <v-img class="room-images lightBg" height="300" :src="imagesUrl[0]" />
      </div>
      <div class="small-images-wrapper">
        <v-img
          class="room-images room-small lightBg"
          height="100"
          :src="imagesUrl[1]"
        />
        <v-img
          class="room-images room-small lightBg"
          height="100"
          :src="imagesUrl[2]"
        />
        <v-img
          class="room-images room-small lightBg"
          height="100"
          :src="imagesUrl[3]"
        />
      </div>
    </v-col>
    <v-col cols="12" md="7">
      <v-form lazy-validation ref="form">
        <div class="d-flex align-start justify-space-between mb-4 mb-md-0">
          <div>
            <p class="text-h6 font-weight-bold">NEW ROOM CATEGORY</p>
          </div>

          <div class="d-none d-md-flex">
            <v-btn color="primary" elevation="0" @click="requestRoomUpdate">Save</v-btn>
          </div>
        </div>

        <v-row>
          <v-col cols="12">
            <label-slot>
              <template v-slot:label>Category</template>
            </label-slot>
            <v-text-field
              :rules="rules.name"
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
                  label="Non-Smoking"
                  hide-details="auto"
                  dense
                ></v-checkbox>
              </v-col>
              <v-col cols="auto">
                <v-checkbox
                  :ripple="false"
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
              :items="amenities"
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
              @change="handleImageUpload"
            />
          </v-col>

          <v-col cols="12">
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
                  v-for="(iter, index) in days"
                  :key="index"
                >
                  <label-slot>
                    <template v-slot:label>{{ iter }}</template>
                  </label-slot>
                  <v-text-field
                    type="number"
                    dense
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col cols="12" class="d-flex d-md-none">
            <v-btn block color="primary" elevation="0" @click="requestRoomUpdate">Save</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
import TitleSlot from "../slots/TitleSlot.vue";
export default {
  name: "CreateRoomForm",
  components: { LabelSlot, TitleSlot },
  data: () => ({
    images: [],
    imagesUrl: [],
    categories: [
      "Deluxe",
      "Standard",
      "Junior",
      "Family",
      "Superior",
      "Presidential",
    ],

    amenities: ["Amenity One", "Amenity Two", "Amenity Three"],
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  }),
  methods: {
    handleImageUpload: function (files) {
      this.uploads = files;
      this.imagesUrl = files.map((key) => URL.createObjectURL(key));
    },
    requestRoomUpdate: function () {
      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        console.log("Event call");
      }
    },
  },
  computed: {
    rules: function () {
      let errors = {};
      errors.name = [(v) => !!v || "Category name is required"];
      errors.description = [(v) => !!v || "Description is required"];
      errors.maxOccupancy = [(v) => !!v || "Maximum occupancy is required"];
      errors.bedSize = [(v) => !!v || "Bed size is required"];
      errors.propertySize = [(v) => !!v || "Property size is required"];
      errors.amenities = [(v) => !!v || "Amenities is required"];
      errors.images = [(v) => !!v || "Images is required"];
      return errors;
    },
  },
  watch: {},
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
