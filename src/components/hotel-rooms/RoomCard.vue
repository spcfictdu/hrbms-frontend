<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-card
        flat
        class="card"
        :elevation="hover ? 12 : 0"
        :class="{ 'on-hover': hover }"
      >
        <div
          class="d-flex flex-column flex-sm-row w-full align-center mx-4 my-0 my-sm-1"
        >
          <v-img
            :src="appendImagePath(room.image)"
            class="room-image-smAndUp d-none d-sm-flex mr-2"
          />
          <v-img
            :src="appendImagePath(room.image)"
            class="room-image-mobile d-flex d-sm-none"
          />
          <div class="width-stretch d-flex flex-column justify-center">
            <v-card-title class="pb-0 font-weight-bold">{{
              room.name.toUpperCase()
            }}</v-card-title>
            <v-card-subtitle class="pb-4 pt-2">
              <span class="text-overline font-weight-bold">{{
                room.category
              }}</span>
              <!-- <v-chip
                small
                outlined
                color="primary"
                class="text-caption font-weight-bold mr-2"
              >
                {{ room.category.toUpperCase() }}
              </v-chip> -->
              {{ ` | ${room.maxOccupancy} max occupancy` }}
            </v-card-subtitle>
            <v-card-text>
              <p class="text-body-2 room-description longText--text mb-0">
                {{ room.description }}
              </p>
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <p class="text-overline accentOne--text ml-2 font-weight-bold">
                DreamStay Discount
              </p>
              <v-spacer />
              <v-btn @click="redirect" small color="primary"
                >View Details</v-btn
              >
            </v-card-actions>
          </div>
        </div>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
export default {
  name: "RoomCard",
  props: { room: Object },
  data: () => ({
    hello: "world",
  }),
  methods: {
    redirect: function () {
      this.$router.push({ name: "Room Details" });
    },
    appendImagePath: function (path) {
      return `${this.$apiPath}/${path}`;
    },
  },
};
</script>

<style scoped>
.width-stretch {
  width: 100%;
}

.card {
  border-radius: 10px;
  overflow: hidden;
}

.card-content {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  backdrop-filter: blur(5px) !important;
}

.room-image-smAndUp {
  max-width: 275px;
  border-radius: 10px;
  aspect-ratio: 16/10;
}

.room-image-mobile {
  max-width: 100%;
  margin-top: 1rem;
  border-radius: 10px;
}

.room-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.on-hover {
  box-shadow: 10px 50px #000000;
  transition: 0.5s;
}
</style>
