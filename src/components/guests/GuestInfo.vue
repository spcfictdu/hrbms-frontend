<template>
  <div class="d-flex flex-row">
    <div class="d-flex flex-column">
      <template v-if="loading">
        <v-skeleton-loader
          :class="classGuestName"
          type="heading"
          class="mb-6"
        />
      </template>
      <div v-else :class="classGuestName">
        {{ guest.fullName }}
      </div>

      <template v-if="loading">
        <div
          class="d-flex flex-column flex-sm-row justify-start text-caption text-md-subtitle-1 longText--text mb-1"
        >
          <div v-for="n in 4" :key="n" class="mr-5 d-flex flex-column">
            <v-skeleton-loader
              type="text"
              height="12"
              width="200"
              class="mb-1"
            />
          </div>
        </div>
      </template>
      <div
        v-else
        class="d-flex flex-column flex-sm-row justify-start text-caption text-md-subtitle-1 longText--text"
      >
        <div class="mr-5">
          <span class="text-uppercase font-weight-bold">Address:</span>
          {{ guest.city }},
          {{ guest.province }}
        </div>
        <div class="mr-5">
          <span class="text-uppercase font-weight-bold">Email:</span>
          {{ guest.email }}
        </div>
        <div class="mr-5">
          <span class="text-uppercase font-weight-bold">Phone:</span>
          {{ guest.phone }}
        </div>
        <div class="mr-5">
          <span class="text-uppercase font-weight-bold">ID Number:</span>
          {{ guest.idNumber }}
        </div>
      </div>
    </div>

    <v-spacer />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "GuestInfo",
  props: {
    guest: {
      type: Object | null,
      required: true,
    },
  },
  data: () => ({
    classGuestName: "",
  }),
  methods: {},
  computed: {
    ...mapGetters("guest", ["getLoading"]),
    loading() {
      return this.getLoading("guest");
    },
    size() {
      return this.$vuetify.breakpoint;
    },
  },
  watch: {
    size: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (newVal.xs) {
          this.classGuestName = "font-weight-bold text-body-1 mt-n3";
        } else {
          this.classGuestName = "text-h6 font-weight-bold mb-2";
        }
      },
    },
  },
};
</script>
