<template>
  <v-row>
    <v-col cols="12" md="5">
      <div class="room-large lightBg mb-2">
        <v-img class="room-images" height="300" :src="null" />
      </div>
      <div class="small-images-wrapper">
        <div class="room-small lightBg">
          <v-img class="room-images" height="100" :src="null" />
        </div>
        <div class="room-small lightBg">
          <v-img class="room-images" height="100" :src="null" />
        </div>
        <div class="room-small lightBg">
          <v-img class="room-images" height="100" :src="null" />
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="7">
      <div
        class="d-flex align-start justify-space-between mb-4 mb-md-0"
      >
        <div>
          <p class="text-h6 font-weight-bold">NEW ROOM</p>
        </div>

        <div class="d-flex">
          <v-btn color="primary" elevation="0">Save</v-btn>
        </div>
      </div>

      <v-row>
        <v-col cols="12">
          <label-slot>
            <template v-slot:label>Name</template>
          </label-slot>
          <v-text-field dense hide-details="auto" outlined required />
        </v-col>

        <v-col cols="12">
          <label-slot>
            <template v-slot:label> Category </template>
          </label-slot>
          <v-select
            outlined
            dense
            :items="categories"
            hide-details="auto"
            clearable
            required
          />
        </v-col>

        <!-- <v-col cols="12">
          <label-slot>
            <template v-slot:label> Description </template>
          </label-slot>
          <v-textarea hide-details="auto" outlined />
        </v-col> -->

        <v-col cols="6">
          <label-slot>
            <template v-slot:label>Maximum Occupancy</template>
          </label-slot>
          <v-text-field
            type="number"
            dense
            hide-details="auto"
            outlined
            required
          />
        </v-col>

        <v-col cols="6">
          <label-slot>
            <template v-slot:label>Floor Number</template>
          </label-slot>
          <v-text-field
            type="number"
            dense
            hide-details="auto"
            outlined
            required
          />
        </v-col>

        <v-col cols="12">
          <label-slot>
            <template v-slot:label>Amenities</template>
          </label-slot>
          <v-autocomplete
            :items="amenities"
            multiple
            hide-details="auto"
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
            outlined
            dense
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
export default {
  name: "CreateRoomForm",
  components: { LabelSlot },
  data: () => ({
    room: {
      name: "The Serenity Suite",
      category: "Family Room",
      maxOccupancy: 2,
      amenities: [
        "Spectacular views",
        "Luxurious bedding",
        "Modern bathroom with toiletries",
        "Private outdoor space",
        "Spectacular views",
        "Luxurious bedding",
        "Modern bathroom",
        "Private space",
      ],
    },

    headers: [
      {
        text: "Rates (in peso)",
        value: "rate",
      },
      {
        text: "Sun",
        value: "sunday",
      },
      {
        text: "Mon",
        value: "monday",
      },
      {
        text: "Tue",
        value: "tuesday",
      },
      {
        text: "Wed",
        value: "wednesday",
      },
      {
        text: "Thu",
        value: "thursday",
      },
      {
        text: "Fri",
        value: "friday",
      },
      {
        text: "Sat",
        value: "saturday",
      },
    ],

    prices: [
      {
        rate: "Regular rate",
        sunday: 1000,
        monday: 1000,
        tuesday: 1000,
        wednesday: 1000,
        thursday: 1000,
        friday: 1000,
        saturday: 1000,
      },
      {
        rate: "Special rate",
        sunday: 700,
        monday: 700,
        tuesday: 700,
        wednesday: 700,
        thursday: 700,
        friday: 700,
        saturday: 700,
      },
    ],

    categories: [
      "Deluxe",
      "Standard",
      "Junior",
      "Family",
      "Superior",
      "Presidential",
    ],

    amenities: ["Amenity One", "Amenity Two", "Amenity Three"],
  }),
};
</script>

<style scoped>
.room-images {
  border-radius: 3px;
}

.small-images-wrapper {
  width: 100%;
  display: flex;
  gap: 0.5rem;
}

.room-large {
  min-height: 300px;
  border-radius: 3px;
}

.room-small {
  min-height: 100px;
  flex-grow: 1;
  border-radius: 3px;
}
</style>
