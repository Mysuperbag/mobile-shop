import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

// 安装懒加载的图片
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  preLoad: 1,
  loading: require('@/assets/img/common/placeholder.png')
})

// 安装toast插件
import toast from "@/components/toast";
Vue.use(toast)


// 导入全局组件
import TabBar from "@/components/tabbar/tab-bar";
import TabBarItem from "@/components/tabbar/tab-bar-item";
import NavBar from "@/components/navbar/nav-bar";
import {Swiper, SwiperItem} from "@/components/swiper";
import GridView from "@/components/gridview/grid-view";
import Scroll from "@/components/scroll/scroll";
import BackTop from "@/components/backtop/back-top";


// 注册全局组件
Vue.component('tab-bar', TabBar)
Vue.component('tab-bar-item', TabBarItem)
Vue.component('nav-bar', NavBar)
Vue.component('swiper', Swiper)
Vue.component('swiper-item', SwiperItem)
Vue.component('grid-view', GridView)
Vue.component('scroll', Scroll)
Vue.component('back-top', BackTop)



Vue.config.productionTip = false

// 初始化VUE实例
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
