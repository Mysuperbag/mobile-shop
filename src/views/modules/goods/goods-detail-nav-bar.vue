<template>
  <div>
    <nav-bar>
      <div slot="left" class="left" @click="backClick">
        <img src="@/assets/img/common/back.svg" alt="返回按钮">
      </div>
      <div slot="center" class="title">
        <div class="title-item"
             v-for="(item,index) in titles" :key="index"
             :class="{active: index === currentIndex}"
             @click="itemClick(index)">
          {{ item }}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
export default {
  name: "goods-detail-nav-bar",
  props:{
    currentIndex:{
      type:Number,
      default: 0
    },
    titles:{
      type:Array,
      default:() =>{
        return  ['商品', '参数', '评论', '推荐']
      }
    }
  },
  methods: {
    itemClick(index) {
      this.$emit('itemClick', index);
    },
    backClick() {
      this.$router.back();
    }
  }
}
</script>

<style scoped>
.title {
  display: flex;
  font-size: 14px;
}

.title-item {
  flex: 1;
}

.active {
  color: var(--color-high-text);
}

.left img {
  margin-top: 12px;
}
</style>
