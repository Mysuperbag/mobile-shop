<template>
  <swiper>
    <swiper-item v-for="item in banners">
      <a :href="item.link"><img :src="item.image" :alt="item.name" @load="imageLoad"></a>
    </swiper-item>
  </swiper>
</template>

<script>


export default {
  name: "home-swiper",
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isLoad: true
    }
  },
  methods: {
    imageLoad() {
      if (this.isLoad) {
        this.$emit("swiperImageLoad");
        this.isLoad = false;
      }
    }
  }
}
</script>

<style scoped>

</style>
