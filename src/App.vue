<template>
  <div id="app">
    <!-- 取消路由缓存 exclude的名字为组件名称  -->
    <keep-alive exclude="goods-detail">
      <router-view/>
    </keep-alive>
    <main-tab-bar/>
    <icon/>
    <icon-svg/>
  </div>

</template>

<script>


import MainTabBar from "@/views/main-tab-bar";
import Icon from "@/views/modules/icon/icon";
import IconSvg from "@/views/modules/icon/svg";

export default {
  name: 'App',
  components: {IconSvg, Icon, MainTabBar},
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({},
        this.$store.state, JSON.parse(sessionStorage.getItem('store'))));
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state));
    });
  },
}
</script>
<style>
/*
  style中的语法 导入需要 @import
  导入base.css,最终会被webpack打包
  base.css引入了normalize.css也会被打包
*/
  @import "~@/assets/css/base.css";
</style>


