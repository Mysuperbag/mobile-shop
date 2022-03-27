<template>
  <div class="tab-control">
    <div class="tab-control-item"
         :class="{active:currentIndex === index}"
         @click="itemClick(index)"
         v-for="(item, index) in titles">
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "page-tab-control",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data(){
    return {
      currentIndex: 0
    }
  },
  methods:{
    itemClick(index) {
      this.currentIndex = index;
      //子主键传父主键
      this.$emit("tabClick", this.currentIndex);
    }
  }
}
</script>

<style scoped>
.tab-control {
  display: flex;
  text-align: center;
  font-size: 16px;
  height: 30px;
  background-color: #fff;

}

.tab-control-item {
  flex: 1;
}

.tab-control-item {
  padding: 5px;
}

.active {
  color: var(--color-high-text);
}

.active span {
  border-bottom: 3px solid var(--color-tint);
}
</style>
