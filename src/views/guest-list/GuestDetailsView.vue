<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader />

    <GuestDetails class="mt-10" :guest="guest" @onQuery="fetch" />
  </div>
</template>

<script>
import GuestDetails from "@/components/guests/GuestDetails.vue";
import PageHeader from "@/components/headers/PageHeader.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "GuestDetailsView",
  components: { GuestDetails, PageHeader },
  props: { id: String },
  data: () => ({}),
  created() {
    this.fetch();
  },
  methods: {
    ...mapActions("guest", ["fetchGuest"]),
    fetch: async function (queryParams = {}) {
      await this.fetchGuest({
        id: this.id,
        queryParams,
      });
    },
  },
  computed: {
    ...mapState("guest", ["guest"]),
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
