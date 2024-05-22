<template>
  <div class="mt-10">
    <CreateRoomForm />
  </div>
</template>

<script>
import CreateRoomForm from "../../components/hotel-rooms/CreateRoomForm.vue";

export default {
  name: "CreateRoomView",
  components: { CreateRoomForm },
  data: () => ({
    hello: "world",
  }),
};
</script>

<style scoped></style>
