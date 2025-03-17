<template>
  <div class="mt-10">
    <CategoryForm
      @validation-event="handleRequest"
      :filledCategory="roomCategory"
      :action="formTitle"
      :loading="loading.form"
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
      "setLoading",
    ]),
    ...mapActions("alerts", ["requireAlertFn"]),
    fetch: async function () {
      if (this.formTitle === "UPDATE") {
        await this.fetchRoomCategory(this.roomCategoryReferenceNumber);
      }
    },
    handleRequest: function (payload) {
      // Prefetch alerts: success, error
      this.requireAlertFn(2);
      this.setLoading({ key: "form", value: true });

      const requests = {
        NEW: ({ data }) => this.createRoomCategory(data),
        UPDATE: ({ data, referenceNumber }) =>
          this.updateRoomCategory({
            roomTypeReferenceNumber: referenceNumber,
            payload: data,
          }),
      };

      const actionsFn = requests[this.formTitle];

      if (actionsFn) {
        actionsFn({
          data: payload,
          referenceNumber: this.roomCategoryReferenceNumber,
        }).then(() => {
          this.setLoading({ key: "form", value: false });
        });
      }
    },
  },
  computed: {
    ...mapState("roomCategories", ["roomCategory", "loading"]),
  },
};
</script>

<style scoped></style>
