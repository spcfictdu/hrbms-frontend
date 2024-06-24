<template>
  <div class="mt-10">
    <CreateRoomForm
      @validation-event="assessRequestCategory"
      :filledCategory="roomCategory"
      :meta="meta"
    />
  </div>
</template>

<script>
import CreateRoomForm from "../../../components/hotel-rooms/CreateRoomForm.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "CreateRoomView",
  components: { CreateRoomForm },
  data: () => ({
    referenceNumber: null,
    meta: {
      status: "",
    },
  }),
  methods: {
    ...mapActions("roomCategories", [
      "fetchRoomCategory",
      "createRoomCategory",
      "updateRoomCategory",
    ]),
    assessRequestCategory: function (payload) {
      if (this.meta.status === "NEW") {
        this.createRoomCategory(payload);
      } else {
        this.updateRoomCategory({
          roomTypeReferenceNumber: this.referenceNumber,
          payload: payload,
        });
      }
    },
    assessRouteParams: function () {
      const referenceNumber = this.$route.params.roomCategoryReferenceNumber;
      if (referenceNumber) {
        // For Updates
        this.referenceNumber = referenceNumber;
        this.meta.status = "UPDATE";
        this.fetchRequestCategory(referenceNumber);
      } else {
        // For Creation
        this.referenceNumber = null;
        this.meta.status = "NEW";
      }
    },
    fetchRequestCategory: function (referenceNumber) {
      this.fetchRoomCategory({
        roomTypeReferenceNumber: referenceNumber,
      });
    },
  },
  computed: {
    ...mapState("roomCategories", {
      roomCategory: "roomCategory",
    }),
  },
  created() {
    this.assessRouteParams();
  },
  watch: {},
};
</script>

<style scoped></style>
