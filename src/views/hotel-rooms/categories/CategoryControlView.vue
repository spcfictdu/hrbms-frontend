<template>
  <div class="mt-10">
    <CategoryForm
      @validation-event="assessRequestCategory"
      :filledCategory="roomCategory"
      :action="formTitle"
    />
  </div>
</template>

<script>
import CategoryForm from "../../../components/hotel-rooms/CategoryForm.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "CategoryControlView",
  components: { CategoryForm },
  props: {
    formTitle: String,
    roomCategoryReferenceNumber: String,
  },
  data: () => ({
    referenceNumber: null,
    meta: {
      status: "",
      loading: false,
    },
  }),
  created() {
    this.fetch();
  },
  methods: {
    ...mapActions("roomCategories", [
      "fetchRoomCategory",
      "createRoomCategory",
      "updateRoomCategory",
      "triggerLoading",
    ]),
    fetch: async function () {
      if (this.formTitle === "UPDATE") {
        await this.fetchRoomCategory({
          roomTypeReferenceNumber: this.roomCategoryReferenceNumber,
        });
      }
    },
    assessRequestCategory: function (payload) {
      this.triggerLoading(true);
      if (this.meta.status === "NEW") {
        this.createRoomCategory(payload);
      } else {
        this.updateRoomCategory({
          roomTypeReferenceNumber: this.referenceNumber,
          payload: payload,
        });
      }
    },
  },
  computed: {
    ...mapState("roomCategories", {
      roomCategory: "roomCategory",
      metaLoading: "meta",
    }),
  },

  watch: {},
};
</script>

<style scoped></style>
