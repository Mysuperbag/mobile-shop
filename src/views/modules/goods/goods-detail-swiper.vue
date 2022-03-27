<template>
  <swiper class="detail-swiper">
    <swiper-item v-for="item in topImages">
      <img :src="item" alt="轮播图">
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  name: "goods-detail-swiper",
  props: {
    topImages: {
      type: Array,
      default() {
        return [];
      }
    }
  }
}
</script>

<style scoped>
.detail-swiper {
  height: 300px;
  overflow: hidden;
}

</style>
