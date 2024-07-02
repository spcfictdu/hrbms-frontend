<template>
  <v-footer tile class="footer-container">
    <v-container>
      <v-row justify="space-between">
        <!-- Links -->
        <v-col cols="12" sm="auto" class="py-0 py-sm-3">
          <div class="flex-items">
            <i class="fi fi-sr-marker"></i>
            <div>Sta Isabel Building, Balibago, Angeles, Pampanga</div>
          </div>
          <div class="divider-breakpoint d-flex d-sm-none"></div>
          <div class="flex-items mt-0 mt-sm-4">
            <i class="fi fi-brands-facebook"></i>
            <div>First City Providential College</div>
          </div>
        </v-col>

        <!-- Dividers Breakpoint -->
        <v-col cols="12" class="py-0 d-flex d-sm-none">
          <div class="divider-breakpoint"></div>
        </v-col>
        <v-col cols="auto" class="d-none d-sm-flex">
          <v-divider vertical></v-divider>
        </v-col>

        <!-- Links -->
        <v-col cols="12" sm="auto" class="py-0 py-sm-3">
          <div class="flex-items">
            <i class="fi fi-sr-envelope"></i>
            <div>FirstCityProvidentialCollege@spcf.edu.ph</div>
          </div>
          <div class="divider-breakpoint d-flex d-sm-none"></div>
          <div class="flex-items mt-0 mt-sm-4">
            <i class="fi fi-sr-phone-flip rotate-icon"></i>
            <div>+639123456789</div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "FooterComponent",
  data: () => ({}),
};
</script>

<style scoped>
@import "~@flaticon/flaticon-uicons/css/all/all.css";
.footer-container {
  background: rgba(47, 69, 183, 0.1);
  padding: 16px 16px;
}

.flex-items {
  display: flex;
  align-items: center;
  column-gap: 10px;
  overflow: hidden;
}

.fi {
  color: rgba(51, 51, 51, 0.9);
  font-size: 25px;
  margin-top: auto;
  transform: translateY(4px);
}

.rotate-icon {
  transform: rotate(90deg) translateY(3px);
}

.divider-breakpoint {
  width: 100%;
  border-bottom: 1px dotted rgba(51, 51, 51, .3);
  margin: 16px 0;
}
</style>
