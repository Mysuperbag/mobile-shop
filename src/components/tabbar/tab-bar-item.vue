<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive" class="item-icon">
      <slot name="icon"></slot>
    </div>
    <div v-else class="item-icon-active">
      <slot name="icon-active"></slot>
    </div>
    <div :style="activeStyle" class="item-text">
      <slot name="text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TarBarItem",
  props: {
    link: {
      type: String,
      require: true
    },
    activeColor: {
      type: String,
      default: 'red'
    },
  },
  computed: {
    //判断当前是否为活跃路径
    isActive() {
      return this.$route.path.indexOf(this.link) !== -1;
    },
    //判断文字的属性样式
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {};
    }
  },
  methods: {
    itemClick() {
      this.$router.replace(this.link);
    }
  },
};
</script>

<style scoped>

.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
}

.item-text {
  font-size: 12px;
  margin-top: 3px;
  color: #333;
}

</style>
