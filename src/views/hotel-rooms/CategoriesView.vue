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
    <room-type-buttons :withAllRooms="withAllRooms" @input-event="attachType" />
    <RoomsList
      @redirect-event="redirect"
      @query-pagination="attachQuery"
      :roomCategories="roomCategories"
      :meta="meta"
    />
  </div>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/categories/RoomsList.vue";
import RoomTypeButtons from "@/components/buttons/RoomTypeButtons.vue";
import { mapActions, mapState } from "vuex";
import { assignParams } from "@/mixins/FormattingFunctions";

export default {
  name: "CategoriesView",
  mixins: [assignParams],
  components: { RoomsList, RoomTypeButtons },
  data: () => ({
    isShowAlert: false,
    withAllRooms: true,
  }),
  methods: {
    ...mapActions("roomCategories", ["fetchRoomCategories", "triggerLoading"]),
    attachQuery: function (params) {
      this.assignParams(params);
    },
    attachType: function (type) {
      let object = {
        roomType: type,
      };

      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const value = object[key];
          if (value === "All Rooms") {
            this.$set(object, key, null);
          } else {
            this.$set(object, key, value);
          }
        }
      }

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
      meta: "meta",
    }),
    handleAlertType() {
      return this.categoryStatus.status !== ""
        ? this.categoryStatus.status.toLowerCase()
        : "success";
    },
  },
  watch: {
    queryParams: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        this.triggerLoading(true).then(() => {
          this.fetchRoomCategories(newVal);
        });
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
