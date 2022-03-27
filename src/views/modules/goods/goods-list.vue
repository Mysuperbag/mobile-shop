<template>
  <grid-view>
    <goods-list-item v-for="(item,index) in goods" :key="index" :goods-item="item"/>
  </grid-view>
</template>

<script>
import GoodsListItem from "@/views/modules/goods/goods-list-item";


export default {
  name: "goods-list",
  components: { GoodsListItem},
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      }
    }
  }
}
</script>

<style scoped>

</style>
