<template>
  <grid-view>
    <goods-list-item v-for="(item, index) in categoryDetail" :key="index" :goods-item="item"/>
  </grid-view>
</template>

<script>
import GoodsListItem from "@/views/modules/goods/goods-list-item";
export default {
  name: "TabContentDetail",
  components: {GoodsListItem},
  props: {
    categoryDetail: {
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>
