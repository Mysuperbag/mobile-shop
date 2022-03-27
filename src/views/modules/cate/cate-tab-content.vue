<template>
  <div>
    <grid-view :cols="3" :line-space="15" :v-margin="20">
      <div class="item" v-for="(item, index) in subcategories" :key="index">
        <a :href="item.link">
          <img class="item-img" :src="item.image" :alt="item.image">
          <div class="item-text">{{item.title}}</div>
        </a>
      </div>
    </grid-view>
  </div>

</template>

<script>
export default {
  name: "cate-tab-content",
  props:{
    subcategories:{
      default(){
        return [];
      }
    }
  }
}
</script>

<style scoped>
.panel img {
  width: 100%;
}

.item {
  text-align: center;
  font-size: 12px;
}

.item-img {
  width: 80%;
}

.item-text {
  margin-top: 15px;
}
</style>

