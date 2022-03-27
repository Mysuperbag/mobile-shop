<template>
  <div class="back-top" @click="topClick">
    <img src="~@/assets/img/common/top.png" alt="返回顶部">
  </div>
</template>

<script>
export default {
  name: "back-top",
  methods:{
    topClick(){
      this.$emit('backTop');
    }
  }
}
</script>

<style scoped>
.back-top {
  position: fixed;
  right: 10px;
  bottom: 60px;
}

.back-top img {
  width: 43px;
  height: 43px;
}
</style>
