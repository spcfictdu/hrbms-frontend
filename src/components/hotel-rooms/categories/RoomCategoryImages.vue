<template>
  <div>
    <div class="room-images" :class="{ 'no-images': images.length === 0 }">
      <div class="room-image" v-for="index in 4" :key="index">
        <div class="item-image">
          <v-img class="image lightBg" :src="images[index - 1]" />
        </div>
        <div class="item-button">
          <v-btn depressed :small="index - 1 > 0" fab color="warning"
            ><v-icon :small="index - 1 > 0">mdi-trash-can</v-icon></v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoomCategoryImages",
  props: {
    images: Array,
  },
  data: () => ({
    deletedImages: [],
  }),
  methods: {
    handleDeletedImages: function (url) {
      this.deletedImages.push(url);
    },
  },
  watch: {
    deletedImages: {
      deeper: true,
      handler: function (newVal) {
        this.$emit("delete-images-event", newVal);
      },
    },
  },
};
</script>

<style scoped>
/* Grid Styling */
.room-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 10px;
  min-height: 100px;
}

.room-images .room-image:first-child {
  grid-column: span 3;
}

.room-images .room-image {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
}

.room-images .room-image .item-image .image {
  min-height: 100px;
}

.room-images .room-image:first-child .item-image .image {
  min-height: 300px;
}

/* Scale Image Action */
.room-images .room-image:hover .item-image {
  transform: scale(1.2);
}

.room-images .room-image:hover .item-image::before {
  opacity: 1;
}

/* Button Show */
.room-images .room-image:hover .item-button {
  opacity: 1;
  transform: translateX(0) translateY(0);
}

/* Main Styling */
.room-images .room-image .item-image {
  height: auto;
  transform: translateZ(0);
  display: block;
  transition: transform 750ms cubic-bezier(0.2, 1, 0.3, 1);
}

.room-images .room-image .item-image::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 500ms cubic-bezier(0.2, 1, 0.3, 1);
  border-radius: 16px;
  z-index: 2;
}

.room-images .room-image .item-button {
  position: absolute;
  right: 5%;
  bottom: 5%;
  opacity: 0;
  transform: translateX(80%) translateY(80%);
  transition: opacity 500ms cubic-bezier(0.2, 1, 0.3, 1),
    transform 500ms cubic-bezier(0.2, 1, 0.3, 1);
  transition-delay: 300ms;
}

/* No Images */
.room-images.no-images .room-image:hover .item-image {
  transform: none;
}

.room-images.no-images .room-image:hover .item-image::before {
  opacity: 0;
}

.room-images.no-images .room-image:hover .item-button {
  opacity: 0;
  transform: translateX(80%) translateY(80%);
}
</style>
