<template>
  <div class="mt-10">
    <v-alert
      :value="isShowAlert"
      :type="handleAlertType"
      class="w-full"
      transition="scroll-y-transition"
    >
      {{ categoryStatus.message ?? categoryStatus.message }}
    </v-alert>
    <room-type-buttons @input-event="attachType" />
    <RoomsList
      v-if="roomCategories"
      @redirect-event="redirect"
      @query-pagination="attachQuery"
      :roomCategories="roomCategories"
    />
  </div>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/categories/RoomsList.vue";
import RoomTypeButtons from "@/components/hotel-rooms/RoomTypeButtons.vue";
import { mapActions, mapState } from "vuex";
import { assignParams } from "@/mixins/FormattingFunctions";

export default {
  name: "CategoriesView",
  mixins: [assignParams],
  components: { RoomsList, RoomTypeButtons },
  data: () => ({
    isShowAlert: false,
  }),
  methods: {
    ...mapActions("roomCategories", ["fetchRoomCategories"]),
    attachQuery: function (params) {
      this.assignParams(params);
    },
    attachType: function (type) {
      const object = {
        roomType: type,
      };
      this.assignParams(object);
    },
    redirect: function (referenceNumber) {
      this.$router.push({
        name: "Room Details",
        params: { roomCategoryReferenceNumber: referenceNumber },
      });
    },
    triggerAlert: function (value) {
      this.isShowAlert = value;
    },
  },
  computed: {
    ...mapState("roomCategories", {
      roomCategories: "roomCategories",
      categoryStatus: "categoryStatus",
    }),
    handleAlertType() {
      return this.categoryStatus.status !== ""
        ? this.categoryStatus.status.toLowerCase()
        : "success";
    },
  },
  watch: {
    queryParams: {
      deep: true,
      handler: function (newVal) {
        this.fetchRoomCategories(newVal);
      },
    },
    categoryStatus: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (newVal.status !== "") {
          this.triggerAlert(true);
          let interval = setInterval(() => {
            this.triggerAlert(false);
            clearInterval(interval);
          }, 3000);
        }
      },
    },
  },
};
</script>

<style scoped></style>
