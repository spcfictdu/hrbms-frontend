<template>
  <v-card flat outlined class="card-container">
    <div>
      <div class="image-container">
        <div class="text-title">About Us</div>
      </div>
      <p class="text-container text-muted text-body-2 font-weight-regular">
        Welcome to First City Providential College, where elegance and comfort await in the heart
        of the city. Our beautifully designed rooms and suites, exceptional
        dining, relaxing spa, and state-of-the-art fitness center create a
        perfect blend of luxury and convenience. Whether you're here for
        business or leisure, our dedicated team provides personalized service to
        ensure your stay is memorable and exceptional. Experience unparalleled
        hospitality at First City Providential College, where every detail is crafted to exceed
        your expectations.
      </p>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "AboutSection",
  data: () => ({}),
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Marcellus+SC&display=swap");

.text-title {
  font-family: "Marcellus SC", serif;
  font-size: 2.5rem;
  line-height: 1.2;
  color: white;
}

.text-muted {
  color: #555;
}

.card-container {
  padding: 24px 0;
}

.image-container {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  width: 100%;
  padding: 28px;
  display: flex;
  justify-content: center;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url(../../../assets/bgImage.jpg) no-repeat center/cover;
}

.text-container {
  margin: 24px 0 0 0;
  padding: 0 24px;
  text-align: center;
}
</style>
