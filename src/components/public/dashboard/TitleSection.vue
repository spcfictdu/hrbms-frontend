<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card flat outlined class="card-container">
        <div>
          <div class="text-title mb-4">Unwind in Luxury and Comfort</div>
          <p class="text-muted mb-0">
            Discover the Perfect Blend of Elegance, Comfort, and Warm
            Hospitality
          </p>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-img :src="sampleImage" alt="Page Image" class="image-container"></v-img>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "TitleSection",
  data: () => ({
    sampleImage: require("../../../assets/bgImage-5.png"),
  })
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Marcellus+SC&display=swap");

.text-title {
  font-family: "Marcellus SC", serif;
  font-size: 2.5rem;
  line-height: 1.2;
}

.text-muted {
  color: #555;
}

.card-container {
  padding: 32px;
  min-height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.image-container {
  max-width: 100%;
  min-height: 350px;
  border-radius: 10px;
}
</style>
