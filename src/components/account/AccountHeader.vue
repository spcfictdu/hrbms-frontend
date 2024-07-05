<template>
  <div class="d-flex pb-4">
    <div class="d-flex flex-column flex-grow-1">
      <div class="text-body-1 text-sm-h6 text-uppercase font-weight-bold mb-2">
        Dela Cruz, JUAN SOMETHING
      </div>
      <div
        class="d-flex flex-column flex-sm-row justify-space-between text-caption text-md-subtitle-1 address--text"
      >
        <div>
          <span class="span-style">Address:</span> Angeles City, Pampanga
        </div>
        <div><span class="span-style">Email:</span> juandelacruz@gmail.com</div>
        <div><span class="span-style">Phone:</span> 09821011212</div>
      </div>
    </div>
    <div class="d-flex justify-end flex-grow-1">
      <v-btn icon outlined color="primary"
        ><v-icon>mdi-dots-vertical</v-icon></v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountHeader",
  data: () => ({}),
};
</script>

<style scoped>
.address--text {
  color: #555555;
}
.span-style {
  text-transform: uppercase;
  font-weight: bold;
}
</style>
