

## 一、创建项目

### 1.1 初始化项目

使用 `Vue CLI` 创建项目 

```
vue create small
```

导入`Vue Router` 项目依赖

```
npm install vue-router
```

导入`Vuex` 项目依赖

```
npm install vuex --save
```

导入 `axios` 项目依赖

```
npm install axios --save
```



### 1.2 目录划分

```lua
├── dist				    -- 构建⽣成的部署⽂件 
├── node_modules	 		-- node插件 
├── public				  	-- 静态资源（如：favicon.ico、第三⽅插件等，⽆需再次处理的⽂件）
├── src 
|   ├── api			    	-- 网络请求封装
│ 	├── assets 				-- 静态资源（如：scss、img等，需脚⼿架编译、压缩等再次处理的⽂介绍件）
│ 	├── components			-- 公共组件 
│ 	├── mixins 				-- 混⼊ 
│ 	├── router 				-- 路由 
│ 	├── store 				-- 状态管理 
│ 	├── utils 				-- ⼯具类 
│ 	├── views 				-- 业务相关 
│ 	├── App.vue 			-- 挂载的APP
│ 	├── main.js 			-- 程序主入口

├── babel.config.js		
├── .browserslistrc
├── .editorconfig
├── .eslintrc.js
├── package.json 		    -- 项目的依赖
├── package-lock.json 		-- 项目锁定的依赖
└── vue.config.js 		  	-- vue-cli脚⼿架配置	
```



### 1.3 配置文件

**配置vue.config.js**

```js
/**
 * 配置参考: https://cli.vuejs.org/zh/config/
 */
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'api': '@/api',
        'assets': '@/assets',
        'img': 'assets/img',
        'components': '@/components',
        'views': '@/views',
      }
    }
  }
}
```

**配置@/views/App.vue**

导入 [normalize.css](https://github.com/necolas/normalize.css) 和 base.css 并将 mormalize.css导入base.css，

在App.vue中导入base.css,最终会被webpack打包

```vue
<style>
/*
  style中的语法 导入需要 @import
  导入base.css,最终会被webpack打包
  base.css引入了normalize.css也会被打包
*/
	@import "~@/assets/css/base.css";
</style>
```

**配置@/router/index.js**

```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
```

**配置@/store/index.js**

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
```



**配置@/api/request.js**

```js
import axios from "axios";

export default function request(option) {
  return new Promise((resolve, reject) => {

    //1. 初始化 axios 实例
    const http = axios.create({
      baseURL: 'http://152.136.185.210:7878/api/m5',
      timeout: 5000
    })

    //2. 配置 axios 请求
    http.interceptors.request.use(config => {
      return config;
    }, error => {
      return error;
    })

    //3. 配置 axios 拦截
    http.interceptors.response.use(res => {
      return res.data;
    }, error => {
      return error
    })

    //4. 封装 axios 网络请求
    http(option).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err)
    })
  })

}
```



**main.js**

```js
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```



### 1.5 封装底部TabBar

> 创建 `@/components/tabbar/tab-bar` 和 `@/components/tabbar/tab-bar-item`
>
> 在 `main.js` 将 `tab-bar` 和 `tab-bar-item` 注册到全局组件
>
> 创建 `@/views/main-tab-bar` 和需要跳转的页面组件，并配置路由 `@/router/index.js`
>
> 在 App 中导入 `main-tab-bar` 并配置 `router-view` 渲染的位置

**@/components/tabbar/tab-bar.vue**

```vue
<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TabBar"
}
</script>

<style scoped>
#tab-bar {
  /* 利用flex布局 */
  display: flex;

  /* 定位相关 */
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  /* 本身的样式 */
  background-color: #f6f6f6;
  height: 49px;
  border-top: 1px solid #eee;
  box-shadow: 0 -1px 1px rgba(100, 100, 100, .05);
}
</style>
```

**@/components/tabbar/tab-bar-item.vue**


```vue
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
      //str.indexOf() 返回某个指定的字符串值在字符串中首次出现的位置。  
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
```

**@/views/main.js**

```js
// 导入全局组件
import TabBar from "@/components/tabbar/tab-bar";
import TabBarItem from "@/components/tabbar/tab-bar-item";

// 注册全局组件
Vue.component('tab-bar', TabBar)
Vue.component('tab-bar-item', TabBarItem)
```

**@/views/main-tab-bar.vue**

```vue
<template>
  <tab-bar>
    <tab-bar-item link="/home" active-color="pink">
      <template v-slot:icon><img src="@/assets/img/tabbar/home.svg" alt=""></template>
      <template v-slot:icon-active><img src="@/assets/img/tabbar/home_active.svg" alt=""></template>
      <template v-slot:text>
        <div>首页</div>
      </template>
    </tab-bar-item>

    <tab-bar-item link="/category">
      <template v-slot:icon><img src="@/assets/img/tabbar/category.svg" alt=""></template>
      <template v-slot:icon-active><img src="@/assets/img/tabbar/category_active.svg" alt=""></template>
      <template v-slot:text>
        <div>分类</div>
      </template>
    </tab-bar-item>

    <tab-bar-item link="/cart">
      <template v-slot:icon><img src="@/assets/img/tabbar/cart.svg" alt=""></template>
      <template v-slot:icon-active><img src="@/assets/img/tabbar/cart_active.svg" alt=""></template>
      <template v-slot:text>
        <div>购物车</div>
      </template>
    </tab-bar-item>

    <tab-bar-item link="/profile">
      <template v-slot:icon><img src="@/assets/img/tabbar/profile.svg" alt=""></template>
      <template v-slot:icon-active><img src="@/assets/img/tabbar/profile_active.svg" alt=""></template>
      <template v-slot:text>
        <div>我的</div>
      </template>
    </tab-bar-item>
  </tab-bar>
</template>

<script>
export default {
  name: "main-tab-bar"
}
</script>

<style scoped>
.item-icon img, .item-icon-active img {
  width: 24px;
  height: 24px;
  margin-top: 5px;
  vertical-align: middle;
}
</style>

```

**@/views/modules/home/home.vue**

```vue
<template>
  <div>
    <h2>首页</h2>
  </div>
</template>

<script>
export default {
  name: "home"
}
</script>

<style scoped>

</style>
```

**@/views/modules/cate/cate.vue**

```vue
<template>
<div>
  <h2>商品分类</h2>
</div>
</template>

<script>
export default {
  name: "cate"
}
</script>

<style scoped>

</style>
```

**@/views/modules/cart/cart.vue**

```vue
<template>
<div>
  <h2>购物车</h2>
</div>
</template>

<script>
export default {
  name: "cart"
}
</script>

<style scoped>

</style>
```

**@/views/modules/profile/profile.vue**

```vue
<template>
<div>
  <h2>我的档案</h2>
</div>
</template>

<script>
export default {
  name: "profile"
}
</script>

<style scoped>

</style>
```

**@/views/page/404.vue**

```vue
<template>
  <div>
    <h2>404 Not Found</h2>
  </div>
</template>

<script>
export default {
  name: "404"
}
</script>

<style scoped>

</style>
```

**@/router/index.js**

```js
import Vue from 'vue';
import VueRouter from 'vue-router';

//1.安装路由插件
Vue.use(VueRouter);

const routes = [
  //路由重定向 
  {
    path: '/',
    redirect: '/home'
  },
   //路由跳转
  {
    path: "/home",
    component: () => import('@/views/modules/home/home')
  },
  {
    path: "/category",
    component: () => import('@/views/modules/cate/cate'),
  },
  {
    path: "/cart",
    component: () => import('@/views/modules/cart/cart')
  },
  {
    path: "/profile",
    component: () => import('@/views/modules/profile/profile')
  },
   //通配符，配置路由没有找到后跳转的页面
  {
    path: "*" ,
    component: () => import('@/views/page/404')
  }
];


//2.创建路由对象
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//3. 解决重复点击路由报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
};

//4.导出路由
export default router;
```

**@/views/App.vue**

```vue
<template>
  <div id="app">
    <!--  路由渲染  -->  
     <router-view/>
    <!-- 底部切换栏   -->
    <main-tab-bar/>
  </div>
</template>

<script>

import MainTabBar from "@/views/main-tab-bar";

export default {
  name: 'App',
  components: {MainTabBar}
}
</script>

<style>
  @import "~@/assets/css/base.css";
</style>
```



## 二、首页开发

需要优化的点，切换标签控件可以记录原先的位置并跳转回去



### 2.1 顶部NavBar

> 创建 `@components/navbar/nav-bar`并通过 `main.js` 中将 `nav-bar` 注册到全局组件

**@components/navbar/nav-bar.vue**

```vue
<template>
  <div class="nav-bar">
    <div class="nav-left">
      <slot name="left"></slot>
    </div>

    <div class="nav-center">
      <slot name="center">标题</slot>
    </div>

    <div class="nav-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "nav-bar"
}
</script>

<style scoped>
.nav-bar {
  position: relative;
  z-index: 10;

  display: flex;

  height: 44px;
  line-height: 44px;
  text-align: center;

  /*border-bottom: 1px solid #eee;*/
  box-shadow: 0 1px 1px rgba(100, 100, 100, 0.1);
}

.nav-left, .nav-right {
  width: 60px;
}

.nav-center {
  flex: 1;
}
</style>
```

**@/views/main.js**

```js
import NavBar from "@/components/navbar/nav-bar";
Vue.component('nav-bar', NavBar)
```

**@/views/modules/home/home.vue**

```vue
<template>
  <div id="home">
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>购物街</div>
      </template>
    </nav-bar>
  </div>
</template>

<script>
export default {
  name: "home"
}
</script>

<style scoped>
#home {
  /* 100的屏幕高度占比 */
  height: 100vh;
  position: relative;
}

.nav-bar {
  color: #FFF;
  font-weight: 700;
  background-color: var(--color-tint);
}
</style>
```



### 2.2 首页推荐组件

> 1、创建全局组件 `@/components/swiper/swiper` 和 `@/components/swiper/swiper-item` 
>
> 2、将 `swiper` 和 `swiper-item` 导出到 `@/components/swiper/index.js`  并通过 `main.js` 注册到全局组件 
>
> 3、创建局部组件
>
> - 轮播图组件  `@/views/modules/home/home-swiper` 
> - 商品推荐组件`@/views/modules/home/home-recommend` 
> - 本周流行组件 `@/views/modules/home/home-popular`
>
> 4、封装首页的请求 `@/api/home.js` 获取轮播图和推荐商品的数据并传入子组件中

**@/components/swiper/swiper.vue**

```vue
<template>
  <div id="hy-swiper">
    <div class="swiper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <slot></slot>
    </div>
    <slot name="indicator">
    </slot>
    <div class="indicator">
      <slot name="indicator" v-if="showIndicator && slideCount>1">
        <div v-for="(item, index) in slideCount" class="indi-item" :class="{active: index === currentIndex-1}"
             :key="index"></div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "swiper",
  props: {
    interval: {
      type: Number,
      default: 3000
    },
    animDuration: {
      type: Number,
      default: 300
    },
    moveRatio: {
      type: Number,
      default: 0.25
    },
    showIndicator: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      slideCount: 0, // 元素个数
      totalWidth: 0, // swiper的宽度
      swiperStyle: {}, // swiper样式
      currentIndex: 1, // 当前的index
      scrolling: false, // 是否正在滚动
    }
  },
  mounted: function () {
    // 1.操作DOM, 在前后添加Slide
    setTimeout(() => {
      this.handleDom();

      // 2.开启定时器
      this.startTimer();
    }, 5000)
  },
  methods: {
    /**
     * 定时器操作
     */
    startTimer: function () {
      this.playTimer = window.setInterval(() => {
        this.currentIndex++;
        this.scrollContent(-this.currentIndex * this.totalWidth);
      }, this.interval)
    },
    stopTimer: function () {
      window.clearInterval(this.playTimer);
    },

    /**
     * 滚动到正确的位置
     */
    scrollContent: function (currentPosition) {
      // 0.设置正在滚动
      this.scrolling = true;

      // 1.开始滚动动画
      this.swiperStyle.transition = 'transform ' + this.animDuration + 'ms';
      this.setTransform(currentPosition);

      // 2.判断滚动到的位置
      this.checkPosition();

      // 4.滚动完成
      this.scrolling = false
    },

    /**
     * 校验正确的位置
     */
    checkPosition: function () {
      window.setTimeout(() => {
        // 1.校验正确的位置
        this.swiperStyle.transition = '0ms';
        if (this.currentIndex >= this.slideCount + 1) {
          this.currentIndex = 1;
          this.setTransform(-this.currentIndex * this.totalWidth);
        } else if (this.currentIndex <= 0) {
          this.currentIndex = this.slideCount;
          this.setTransform(-this.currentIndex * this.totalWidth);
        }

        // 2.结束移动后的回调
        this.$emit('transitionEnd', this.currentIndex - 1);
      }, this.animDuration)
    },

    /**
     * 设置滚动的位置
     */
    setTransform: function (position) {
      this.swiperStyle.transform = `translate3d(${position}px, 0, 0)`;
      this.swiperStyle['-webkit-transform'] = `translate3d(${position}px), 0, 0`;
      this.swiperStyle['-ms-transform'] = `translate3d(${position}px), 0, 0`;
    },

    /**
     * 操作DOM, 在DOM前后添加Slide
     */
    handleDom: function () {
      // 1.获取要操作的元素
      let swiperEl = document.querySelector('.swiper');
      let slidesEls = swiperEl.getElementsByClassName('slide');

      // 2.保存个数
      this.slideCount = slidesEls.length;

      // 3.如果大于1个, 那么在前后分别添加一个slide
      if (this.slideCount > 1) {
        let cloneFirst = slidesEls[0].cloneNode(true);
        let cloneLast = slidesEls[this.slideCount - 1].cloneNode(true);
        swiperEl.insertBefore(cloneLast, slidesEls[0]);
        swiperEl.appendChild(cloneFirst);
        this.totalWidth = swiperEl.offsetWidth;
        this.swiperStyle = swiperEl.style;
      }

      // 4.让swiper元素, 显示第一个(目前是显示前面添加的最后一个元素)
      this.setTransform(-this.totalWidth);
    },

    /**
     * 拖动事件的处理
     */
    touchStart: function (e) {
      // 1.如果正在滚动, 不可以拖动
      if (this.scrolling) return;

      // 2.停止定时器
      this.stopTimer();

      // 3.保存开始滚动的位置
      this.startX = e.touches[0].pageX;
    },

    touchMove: function (e) {
      // 1.计算出用户拖动的距离
      this.currentX = e.touches[0].pageX;
      this.distance = this.currentX - this.startX;
      let currentPosition = -this.currentIndex * this.totalWidth;
      let moveDistance = this.distance + currentPosition;

      // 2.设置当前的位置
      this.setTransform(moveDistance);
    },

    touchEnd: function (e) {
      // 1.获取移动的距离
      let currentMove = Math.abs(this.distance);

      // 2.判断最终的距离
      if (this.distance === 0) {
        return
      } else if (this.distance > 0 && currentMove > this.totalWidth * this.moveRatio) { // 右边移动超过0.5
        this.currentIndex--
      } else if (this.distance < 0 && currentMove > this.totalWidth * this.moveRatio) { // 向左移动超过0.5
        this.currentIndex++
      }

      // 3.移动到正确的位置
      this.scrollContent(-this.currentIndex * this.totalWidth);

      // 4.移动完成后重新开启定时器
      this.startTimer();
    },

    /**
     * 控制上一个, 下一个
     */
    previous: function () {
      this.changeItem(-1);
    },

    next: function () {
      this.changeItem(1);
    },

    changeItem: function (num) {
      // 1.移除定时器
      this.stopTimer();

      // 2.修改index和位置
      this.currentIndex += num;
      this.scrollContent(-this.currentIndex * this.totalWidth);

      // 3.添加定时器
      this.startTimer();
    }
  }
}
</script>

<style scoped>
#hy-swiper {
  overflow: hidden;
  position: relative;
}

.swiper {
  display: flex;
}

.indicator {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  bottom: 8px;
}

.indi-item {
  box-sizing: border-box;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #fff;
  line-height: 8px;
  text-align: center;
  font-size: 12px;
  margin: 0 5px;
}

.indi-item.active {
  background-color: rgba(212, 62, 46, 1.0);
}
</style>
```

**@/components/swiper/swiper-item.vue**

```vue
<template>
    <div class="slide">
      <slot></slot>
    </div>
</template>

<script>
	export default {
		name: "swiper-item"
	}
</script>

<style scoped>
  .slide {
    width: 100%;
    flex-shrink: 0;
  }

  .slide img {
    width: 100%;
  }
</style>
```

**@/components/swiper/index.js**

```js
import Swiper from './swiper'
import SwiperItem from './swiper-item'

export {
  Swiper, SwiperItem
}
```

**@/views/main.js**

```js
import {Swiper, SwiperItem} from "@/components/swiper";

Vue.component('swiper', Swiper)
Vue.component('swiper-item', SwiperItem)
```

**@/views/modules/home/home-swiper.vue**

```vue
<template>
  <swiper>
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <img :src="item.image" :alt="item.name">
      </a>
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
        return [];
      }
    }
  },

}
</script>

<style scoped>

</style>
```

**@/views/modules/home/home-recommend.vue**

```vue
<template>
  <div class="recommend">
    <div class="recommend-list" v-for="item in recommends">
      <a :href="item.link">
        <img :src="item.image" :alt="item.name">
        <div>{{ item.title }}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "home-recommend",
  props: {
    recommends: {
      type: Array,
      default() {
        return [];
      }
    }
  }
}
</script>

<style scoped>
.recommend {
  display: flex;
  width: 100%;

  text-align: center;
  font-size: 16px;

  padding: 5% 0 5%;

  border-bottom: 8px solid #eee;
}

.recommend-list {
  flex: 1;
}
.recommend-list img{
  width: 90%;
  margin-bottom: 5%;
}
</style>
```

**@/views/modules/home/home-popular.vue**

```vue
<template>
  <div class="feature">
    <a href="http://act.mogujie.com/zzlx67">
      <img src="~@/assets/img/home/recommend.jpg" alt="本周流行">
    </a>
  </div>
</template>

<script>
export default {
  name: "home-popular"
}
</script>

<style scoped>
.feature img {
  width: 100%;
}

</style>
```

**@/views/modules/home/home.vue**

```vue
<template>
  <div id="home">
    <!-- 导航栏  -->
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>购物街</div>
      </template>
    </nav-bar>

    <!--  轮播图  -->
    <home-swiper :banners="banner.list"/>
    <!-- 商品推荐 -->
    <home-recommend :recommends="recommend.list"/>
    <!-- 本周流行 -->
    <home-popular/>
  </div>
</template>

<script>
import {getHomeDataApi} from "@/api/home";
import HomeSwiper from "@/views/modules/home/home-swiper";
import HomeRecommend from "@/views/modules/home/home-recommend";
import HomePopular from "@/views/modules/home/home-popular";

export default {
  name: "home",
  components: {HomePopular, HomeRecommend, HomeSwiper},
  data() {
    return {
      //主页轮播图数据
      banner: '',
      //商品推荐数据
      recommend: '',
    }
  },
  //组件调用后自动请求
  created() {
    this.getHomeData();
  },
  methods: {
    // 获取主页轮播图和推荐数据
    getHomeData() {
      getHomeDataApi().then(res => {
        this.banner = res.data.banner;
        this.recommend = res.data.recommend;
      })
    }
  }
}
</script>

<style scoped>
#home {
  /* 100的屏幕高度占比 */
  height: 100vh;
  position: relative;
}

.nav-bar {
  color: #FFF;
  font-weight: 700;
  background-color: var(--color-tint);
}
</style>
```



### 2.4 首页标签控件

> 1、创建局部组件 `@/views/page-tab-control`，
>
> ​	点击页面标签会发送当前选中的索引事件，并且会有选中的样式显示 
>
> 2、将标签控件导入到首页展示
>
> ​	设置系统常量来固定选择的商品类型，点击页面标签获得子组件的下标，并在父组件中获取，将获取的下标与商品类型对比并转换，用于获取商品搜索的类型切换。

**@/views/page-tab-control**

```vue
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
```

**@/utils/const.js**

```js
export const POP = 'pop';
export const NEW = 'new';
export const SELL = 'sell';
```

**@/views/modules/home/home.vue**

```vue
<template>
  <div id="home">
    <!-- 导航栏  -->
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>购物街</div>
      </template>
    </nav-bar>

    <!--  轮播图  -->
    <home-swiper :banners="banner.list"/>

    <!-- 商品推荐 -->
    <home-recommend :recommends="recommend.list"/>

    <!-- 本周流行 -->
    <home-popular/>

    <!-- 商品类别点击 -->
    <page-tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClickHandler"/>

  </div>
</template>

<script>
import {getHomeDataApi} from "@/api/home";
import HomeSwiper from "@/views/modules/home/home-swiper";
import HomeRecommend from "@/views/modules/home/home-recommend";
import HomePopular from "@/views/modules/home/home-popular";
import PageTabControl from "@/views/page-tab-control";
import {NEW, POP, SELL} from "@/utils/const";

export default {
  name: "home",
  components: {PageTabControl, HomePopular, HomeRecommend, HomeSwiper},
  data() {
    return {
      //主页轮播图数据
      banner: '',
      //商品推荐数据
      recommend: '',
      //页面标签控件默认选中项
      currentType: POP
    }
  },
  //组件调用后自动请求
  created() {
    this.getHomeData();
  },
  methods: {
    /**
     * 事件监听的方法
     */
    // 切换商品类型数据
    tabClickHandler(index) {
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
          break;
      }
    },

    /**
     * 网络请求的方法
     */
    // 获取主页轮播图和推荐数据
    getHomeData() {
      getHomeDataApi().then(res => {
        this.banner = res.data.banner;
        this.recommend = res.data.recommend;
      })
    }
  }
}
</script>

<style scoped>
#home {
  /* 100的屏幕高度占比 */
  height: 100vh;
  position: relative;
}

.nav-bar {
  color: #FFF;
  font-weight: 700;
  background-color: var(--color-tint);
}
</style>
```



### 2.5 首页商品信息

> 1、创建全局组件 `@/components/gripview/grip-view` 并通过 `@/views/main.js` 将响应式展示组件注册到全局
>
> 2、创建局部组件 
>
> ​	商品列表数据`@/views/modules/goods/goods-list` 
>
> ​	商品详情数据 `@/views/modules/goods/goods-list-item` 

**@/components/gripview/grip-view**

```vue
<template>
  <div class="grid-view" ref="gridView">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "grid-view",
  props: {
    cols: {
      type: Number,
      default: 2
    },
    hMargin: {
      type: Number,
      default: 8
    },
    vMargin: {
      type: Number,
      default: 8
    },
    itemSpace: {
      type: Number,
      default: 8
    },
    lineSpace: {
      type: Number,
      default: 8
    }
  },
  mounted: function () {
    setTimeout(this._autoLayout, 20)
  },
  updated: function () {
    this._autoLayout()
  },
  methods: {
    _autoLayout: function () {
      // 1.获取gridEl和children
      // 注: 这里为什么不用document.querySelector呢?
      // 答: 因为如果在项目中, 多处都用到了grid-view, 那么这里就不确定获取的是哪一个了.
      let gridEl = this.$refs.gridView;
      let children = gridEl.children;

      // 2.设置gridEl的内边距
      gridEl.style.padding = `${this.vMargin}px ${this.hMargin}px`

      // 3.计算item的宽度
      let itemWidth = (gridEl.clientWidth - 2 * this.hMargin - (this.cols - 1) * this.itemSpace) / this.cols;
      for (let i = 0; i < children.length; i++) {
        let item = children[i];
        item.style.width = itemWidth + 'px';
        if ((i+1) % this.cols !== 0) {
          item.style.marginRight = this.itemSpace + 'px'
        }
        if (i >= this.cols) {
          item.style.marginTop = this.lineSpace + 'px'
        }
      }
    }
  }
}
</script>

<style scoped>
.grid-view {
  display: flex;
  flex-wrap: wrap;
}
</style>
```

**@/views/main.js**

```js
import GridView from "@/components/gridview/grid-view";
Vue.component('grid-view', GridView)
```

**@/views/modules/goods/goods-list.vue**

```vue
<template>
  <grid-view>
    <goods-list-item v-for="(item,index) in goods" :key="index" :goods-item="item"/>
  </grid-view>
</template>

<script>
import GoodsListItem from "@/views/modules/goods/goods-list-item";
export default {
name: "goods-list",
  components: {GoodsListItem},
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
```

**@/views/modules/goods/goods-list-item.vue**

```vue
<template>
  <div class="goods" @click="goodsDetail(goodsItem)">
    <img :src="image" :alt="goodsItem.title">
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">￥{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "goods-list-item",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    //图片字段不相同的处理方式
    image() {
      return this.goodsItem.img || this.goodsItem.image || this.goodsItem.show.img
    }
  },
  methods: {
    goodsDetail(goodsItem) {
      let id = goodsItem.iid || goodsItem.item_id;
      this.$router.push('/goods/' + id);
      //路径跳转接收对象
      //this.$router.push({path: '/goods/', query: {id}});
    }
  }
}
</script>

<style scoped>
.goods {
  padding-bottom: 40px;
  position: relative;
}

.goods img {
  width: 100%;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: '';
  position: absolute;
  left: -15px;
  top: 0;
  width: 14px;
  height: 14px;
  /*background: url("~assets/img/common/collect.svg") 0 0/14px 14px;*/
  background: url("~@/assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>
```

**@/views/modules/home/home.vue**

```vue
<template>
  <div id="home">
    <!-- 导航栏  -->
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>购物街</div>
      </template>
    </nav-bar>

    <!--  轮播图  -->
    <home-swiper :banners="banner.list"/>

    <!-- 商品推荐 -->
    <home-recommend :recommends="recommend.list"/>

    <!-- 本周流行 -->
    <home-popular/>

    <!-- 商品类别点击 -->
    <page-tab-control class="tab-control"
                      :titles="['流行','新款','精选']"
                      @tabClick="tabClickHandler"/>

    <!-- 商品列表 -->
    <goods-list :goods="showGoods"/>

  </div>
</template>

<script>
import {NEW, POP, SELL} from "@/utils/const";
import {getHomeDataApi, getHomeGoodsApi} from "@/api/home";
import HomeSwiper from "@/views/modules/home/home-swiper";
import HomeRecommend from "@/views/modules/home/home-recommend";
import HomePopular from "@/views/modules/home/home-popular";
import PageTabControl from "@/views/page-tab-control";
import GoodsList from "@/views/modules/goods/goods-list";

export default {
  name: "home",
  components: {GoodsList, PageTabControl, HomePopular, HomeRecommend, HomeSwiper},
  data() {
    return {
      //主页轮播图数据
      banner: '',
      //商品推荐数据
      recommend: '',
      //页面标签控件默认选中项
      currentType: POP,
      //商品展示的数据
      goods: {
        [POP]: {page: 0, list: []},
        [NEW]: {page: 0, list: []},
        [SELL]: {page: 0, list: []},
      }
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  //组件调用后自动请求
  created() {
    //获取到所有数据才展示数据
    Promise.all([
      this.getHomeData(),
      this.getHomeGoods(POP),
      this.getHomeGoods(NEW),
      this.getHomeGoods(SELL),
    ])
  },
  methods: {
    /**
     * 事件监听的方法
     */
    // 切换商品类型数据
    tabClickHandler(index) {
      //当前商品的类型转换
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
          break;
      }
    },

    /**
     * 网络请求的方法
     */
    // 获取主页轮播图和推荐数据
    getHomeData() {
      getHomeDataApi().then(res => {
        this.banner = res.data.banner;
        this.recommend = res.data.recommend;
      })
    },

    // 获取商品类型数据
    getHomeGoods(type) {
      //默认页面为0，需要在默认页面上 + 1
      const page = this.goods[type].page + 1;
      getHomeGoodsApi(type, page).then(res => {
        // 将请求到的数组数据深拷贝到对象数组中
        this.goods[type].list.push(...res.data.list);
        // res的分页数据会将设置的页面覆盖，所以要重新在页码 + 1
        this.goods[type].page += 1;
      })
    }
  }
}
</script>

<style scoped>
#home {
  /* 100的屏幕高度占比 */
  height: 100vh;
  position: relative;
}

.nav-bar {
  color: #FFF;
  font-weight: 700;
  background-color: var(--color-tint);
}
</style>
```



### 2.6 首页滚动重构

> 1、安装 `better-scroll`,并创建全局滚动组件 `@/components/scroll/scroll.vue`，并注册到 `@/views/main.js` 中
>
> 2、将首页包裹在滚动组件中，并设置滚动的区域，当下拉时会加载更多。

**@/components/scroll/scroll.vue**

```vue
<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: "scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  data() {
    return {
      scroll: {},
    };
  },
  watch: {
    data() {
      setTimeout(this.refresh, 20)
    }
  },
  mounted() {
    setTimeout(this.initScroll,20)
  },
  methods: {
    initScroll(){
      /**
       *
       * better-scroll文档:
       *    https://better-scroll.github.io/docs/zh-CN/
       *
       * click
       *    是否支持原生click事件
       *
       * probeType
       *    决定是否派发 scroll 事件
       *           1. probeType 为 0，在任何时候都不派发 scroll 事件，
       *           2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
       *           3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
       *           4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
       *
       * pullUpLoad
       *    插件内部是否使用默认的插件选项对象。
       *
       * observeDOM
       *    是否开启对 content 以及 content 子元素 DOM 改变的探测。
       *    当插件被使用后，当这些 DOM 元素发生变化时，将会触发 scroll 的 refresh 方法。observe-dom 插件具有以下几个特性：
       *      针对改变频繁的 CSS 属性，增加 debounce
       *      如果改变发生在 scroll 动画过程中，则不会触发 refresh
       *
       * observeImage
       *    是否开启对 wrapper 子元素中图片元素的加载的探测。图片的宽度或者高度不确定的情况下，你才需要它。
       */
      // 1.创建scroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
        observeDOM: true,
        observeImage: true,
      });

      // 2.监听滚动的位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          // console.log(position)
          this.$emit('scroll', position)
        })
      }

      // 3.监听scroll滚动到底部
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp');
        })
      }
    },
    // 跳转到位置 默认过渡时间为300ms
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time);
    },
    // 完成上拉加载更多行为
    finishPullUp() {
      // 每次触发 pullingUp 钩子后，
      // 应该主动调用 finishPullUp()
      // 告诉 BetterScroll 准备好下一次的 pullingUp 钩子。
      this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp()
    },
    // 数据刷新
    refresh() {
      // 重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      this.scroll && this.scroll.refresh && this.scroll.refresh()
    },
    // 获取当前y坐标
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }

  }
}
</script>

<style scoped>

</style>
```

**@/views/main.js**

```js
import Scroll from "@/components/scroll/scroll";
Vue.component('scroll', Scroll)
```

**@/views/modules/home/home.vue**

```vue
<template>
  <div id="home">
    <!-- 导航栏  -->
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>购物街</div>
      </template>
    </nav-bar>

   <scroll class="content"
           ref="scroll"
           :probe-type="3"
           :pull-up-load="true"
           @pullingUp="loadMore">
     <!--  轮播图  -->
     <home-swiper :banners="banner.list"/>
     <!-- 商品推荐 -->
     <home-recommend :recommends="recommend.list"/>
     <!-- 本周流行 -->
     <home-popular/>
     <!-- 商品类别点击 -->
     <page-tab-control class="tab-control"
                       :titles="['流行','新款','精选']"
                       @tabClick="tabClickHandler"/>
     <!-- 商品列表 -->
     <goods-list :goods="showGoods"/>
   </scroll>

  </div>
</template>

<script>
import {NEW, POP, SELL} from "@/utils/const";
import {getHomeDataApi, getHomeGoodsApi} from "@/api/home";
import HomeSwiper from "@/views/modules/home/home-swiper";
import HomeRecommend from "@/views/modules/home/home-recommend";
import HomePopular from "@/views/modules/home/home-popular";
import PageTabControl from "@/views/page-tab-control";
import GoodsList from "@/views/modules/goods/goods-list";

export default {
  name: "home",
  components: {GoodsList, PageTabControl, HomePopular, HomeRecommend, HomeSwiper},
  data() {
    return {
      //主页轮播图数据
      banner: '',
      //商品推荐数据
      recommend: '',
      //页面标签控件默认选中项
      currentType: POP,
      //商品展示的数据
      goods: {
        [POP]: {page: 0, list: []},
        [NEW]: {page: 0, list: []},
        [SELL]: {page: 0, list: []},
      }
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  //组件调用后自动请求
  created() {
    //获取到所有数据才展示数据
    Promise.all([
      this.getHomeData(),
      this.getHomeGoods(POP),
      this.getHomeGoods(NEW),
      this.getHomeGoods(SELL),
    ])
  },
  methods: {
    /**
     * 事件监听的方法
     */
    // 切换商品类型数据
    tabClickHandler(index) {
      //当前商品的类型转换
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
          break;
      }
    },

    // 加载更多商品数据
    loadMore() {
      this.getHomeGoods(this.currentType);
    },

    /**
     * 网络请求的方法
     */
    // 获取主页轮播图和推荐数据
    getHomeData() {
      getHomeDataApi().then(res => {
        this.banner = res.data.banner;
        this.recommend = res.data.recommend;
      })
    },

    // 获取商品类型数据
    getHomeGoods(type) {
      //默认页面为0，需要在默认页面上 + 1
      const page = this.goods[type].page + 1;
      getHomeGoodsApi(type, page).then(res => {
        // 将请求到的数组数据深拷贝到对象数组中
        this.goods[type].list.push(...res.data.list);
        // res的分页数据会将设置的页面覆盖，所以要重新在页码 + 1
        this.goods[type].page += 1;
        // 完成上拉加载更多的行为
        this.$refs.scroll.finishPullUp();
      })
    }
  }
}
</script>

<style scoped>
#home {
  /* 100的屏幕高度占比 */
  height: 100vh;
  position: relative;
}

.nav-bar {
  color: #FFF;
  font-weight: 700;
  background-color: var(--color-tint);
}

/* 设置better-scroll滚动的区域 */
.content {
  /*  取消滚动 */
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

</style>
```



### 2.7 首页回到顶部

> 1、创建全局组件 `@/components/backtop/back-top.vue`，并注册到 `@/views/main.js` 中
>
> 2、滚动组件中监听事件，当达到位置时则显示回到顶部组件，并绑定回到顶部事件

**@/components/backtop/back-top.vue**

```vue
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
```

**@/views/main.js**

```js
import BackTop from "@/components/backtop/back-top";
Vue.component('back-top', BackTop)
```

**@/views/modules/home/home.vue**

```vue
<template>
  <div id="home">
    <!-- 导航栏  -->
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>购物街</div>
      </template>
    </nav-bar>

   <!-- 滚动区域  -->
   <scroll class="content"
           ref="scroll"
           :probe-type="3"
           :pull-up-load="true"
           @scroll="contentScroll"
           @pullingUp="loadMore">
     <!--  轮播图  -->
     <home-swiper :banners="banner.list"/>
     <!-- 商品推荐 -->
     <home-recommend :recommends="recommend.list"/>
     <!-- 本周流行 -->
     <home-popular/>
     <!-- 商品类别点击 -->
     <page-tab-control class="tab-control"
                       :titles="['流行','新款','精选']"
                       @tabClick="tabClickHandler"/>
     <!-- 商品列表 -->
     <goods-list :goods="showGoods"/>
   </scroll>

    <!--
         回到顶部
         自定义组件的监听绑定事件: @click.native
    -->
    <back-top @click.native="backTopHandler" v-show="isShowBackTop"/>

  </div>
</template>

<script>
import {NEW, POP, SELL,BACK_TOP_DISTANCE} from "@/utils/const";
import {getHomeDataApi, getHomeGoodsApi} from "@/api/home";
import HomeSwiper from "@/views/modules/home/home-swiper";
import HomeRecommend from "@/views/modules/home/home-recommend";
import HomePopular from "@/views/modules/home/home-popular";
import PageTabControl from "@/views/page-tab-control";
import GoodsList from "@/views/modules/goods/goods-list";

export default {
  name: "home",
  components: {GoodsList, PageTabControl, HomePopular, HomeRecommend, HomeSwiper},
  data() {
    return {
      //主页轮播图数据
      banner: '',
      //商品推荐数据
      recommend: '',
      //页面标签控件默认选中项
      currentType: POP,
      //商品展示的数据
      goods: {
        [POP]: {page: 0, list: []},
        [NEW]: {page: 0, list: []},
        [SELL]: {page: 0, list: []},
      },
      //是否显示回到顶部按钮
      isShowBackTop: false,
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  //组件调用后自动请求
  created() {
    //获取到所有数据才展示数据
    Promise.all([
      this.getHomeData(),
      this.getHomeGoods(POP),
      this.getHomeGoods(NEW),
      this.getHomeGoods(SELL),
    ])
  },
  methods: {
    /**
     * 事件监听的方法
     */
    // 切换商品类型数据
    tabClickHandler(index) {
      //当前商品的类型转换
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
          break;
      }
    },

    // 加载更多商品数据
    loadMore() {
      this.getHomeGoods(this.currentType);
    },

    // 滚动事件监听
    contentScroll(position) {
      // 判断是否显示 BackTop 组件
      this.isShowBackTop = (-position.y) > BACK_TOP_DISTANCE;
    },

    // 回到顶部
    backTopHandler() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },

    /**
     * 网络请求的方法
     */
    // 获取主页轮播图和推荐数据
    getHomeData() {
      getHomeDataApi().then(res => {
        this.banner = res.data.banner;
        this.recommend = res.data.recommend;
      })
    },

    // 获取商品类型数据
    getHomeGoods(type) {
      //默认页面为0，需要在默认页面上 + 1
      const page = this.goods[type].page + 1;
      getHomeGoodsApi(type, page).then(res => {
        // 将请求到的数组数据深拷贝到对象数组中
        this.goods[type].list.push(...res.data.list);
        // res的分页数据会将设置的页面覆盖，所以要重新在页码 + 1
        this.goods[type].page += 1;
        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      })
    }
  }
}
</script>

<style scoped>
#home {
  /* 100的屏幕高度占比 */
  height: 100vh;
  position: relative;
}

.nav-bar {
  color: #FFF;
  font-weight: 700;
  background-color: var(--color-tint);
}

/* 设置better-scroll滚动的区域 */
.content {
  /*  取消滚动 */
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

</style>
```



### 2.8 标签吸附效果

> 1、判断轮播图是否加载完成并获取**滚动区域标签页**元素到顶部的位置
>
> 2、在滚动区域上方添加一个首页标签，如果当前位置比**滚动区域标签页**的位置大，则**滚动区域上方**的标签页吸附住

**@/views/modules/home/home-swiper.vue**

```vue
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
      //节流throttle
      //当第一进入的时候是true，当提交事件完以后就设置为false
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
```

**@/views/modules/home/home.vue**

```vue
<template>
  <div id="home">
    <!-- 导航栏  -->
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>购物街</div>
      </template>
    </nav-bar>

    <!-- 滚动上方标签页 -->
    <page-tab-control class="tab-control"
                      v-show="isTabFixed"
                      :titles="['流行','新款','精选']"
                      @tabClick="tabClickHandler"/>

   <!-- 滚动区域  -->
   <scroll class="content"
           ref="scroll"
           :probe-type="3"
           :pull-up-load="true"
           @scroll="contentScroll"
           @pullingUp="loadMore">
     <!--  轮播图  -->
     <home-swiper :banners="banner.list" @swiperImageLoad="swiperImageLoadHandler"/>
     <!-- 商品推荐 -->
     <home-recommend :recommends="recommend.list"/>
     <!-- 本周流行 -->
     <home-popular/>
     <!-- 商品类别点击 -->
     <page-tab-control class="tab-control"
                       ref="tabControl"
                       :titles="['流行','新款','精选']"
                       @tabClick="tabClickHandler"/>
     <!-- 商品列表 -->
     <goods-list :goods="showGoods"/>
   </scroll>

    <!--
         回到顶部
         自定义组件的监听绑定事件: @click.native
    -->
    <back-top @click.native="backTopHandler" v-show="isShowBackTop"/>

  </div>
</template>

<script>
import {NEW, POP, SELL,BACK_TOP_DISTANCE} from "@/utils/const";
import {getHomeDataApi, getHomeGoodsApi} from "@/api/home";
import HomeSwiper from "@/views/modules/home/home-swiper";
import HomeRecommend from "@/views/modules/home/home-recommend";
import HomePopular from "@/views/modules/home/home-popular";
import PageTabControl from "@/views/page-tab-control";
import GoodsList from "@/views/modules/goods/goods-list";

export default {
  name: "home",
  components: {GoodsList, PageTabControl, HomePopular, HomeRecommend, HomeSwiper},
  data() {
    return {
      //主页轮播图数据
      banner: '',
      //商品推荐数据
      recommend: '',
      //页面标签控件默认选中项
      currentType: POP,
      //商品展示的数据
      goods: {
        [POP]: {page: 0, list: []},
        [NEW]: {page: 0, list: []},
        [SELL]: {page: 0, list: []},
      },
      //是否显示回到顶部按钮
      isShowBackTop: false,
      //滚动区域标签页元素到顶部的位置
      tabOffsetTop: 0,
      //是否显示滚动区域上方的标签页
      isTabFixed: false,
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  //组件调用后自动请求
  created() {
    //获取到所有数据才展示数据
    Promise.all([
      this.getHomeData(),
      this.getHomeGoods(POP),
      this.getHomeGoods(NEW),
      this.getHomeGoods(SELL),
    ])
  },
  methods: {
    /**
     * 事件监听的方法
     */
    // 切换商品类型数据
    tabClickHandler(index) {
      //当前商品的类型转换
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
          break;
      }
    },

    // 加载更多商品数据
    loadMore() {
      this.getHomeGoods(this.currentType);
    },

    // 滚动事件监听
    contentScroll(position) {
      // 判断是否显示 BackTop 组件
      this.isShowBackTop = (-position.y) > BACK_TOP_DISTANCE;

      // 如果当前位置比tabOffsetTop的位置大，则滚动区域上方的标签页吸附住
      this.isTabFixed = (-position.y) > this.tabOffsetTop;
    },

    // 回到顶部
    backTopHandler() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },

    // 判断轮播图是否加载完成并获取元素到顶部的位置
    swiperImageLoadHandler() {
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
    },

    /**
     * 网络请求的方法
     */
    // 获取主页轮播图和推荐数据
    getHomeData() {
      getHomeDataApi().then(res => {
        this.banner = res.data.banner;
        this.recommend = res.data.recommend;
      })
    },

    // 获取商品类型数据
    getHomeGoods(type) {
      //默认页面为0，需要在默认页面上 + 1
      const page = this.goods[type].page + 1;
      getHomeGoodsApi(type, page).then(res => {
        // 将请求到的数组数据深拷贝到对象数组中
        this.goods[type].list.push(...res.data.list);
        // res的分页数据会将设置的页面覆盖，所以要重新在页码 + 1
        this.goods[type].page += 1;
        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      })
    }
  }
}
</script>

<style scoped>
#home {
  /* 100的屏幕高度占比 */
  height: 100vh;
  position: relative;
}

.nav-bar {
  color: #FFF;
  font-weight: 700;
  background-color: var(--color-tint);
}

/* 设置better-scroll滚动的区域 */
.content {
  /*  取消滚动 */
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control {
  position: relative;
  z-index: 9;
}

</style>
```



### 2.9 保持首页状态

> 1、在 `@/views/App.vue` 中设置路由缓存
>
> 2、新建2个在 `keep-alive` 组件使用的函数

**@/views/App.vue**

```vue
<template>
  <div id="app">
    <!--  路由渲染  -->
    <keep-alive>
      <router-view/>
    </keep-alive>
    <!-- 底部切换栏   -->
    <main-tab-bar/>
  </div>
</template>

<script>

import MainTabBar from "@/views/main-tab-bar";

export default {
  name: 'App',
  components: {MainTabBar}
}
</script>

<style>
@import "~@/assets/css/base.css";
</style>
```

**@/views/modules/home/home.vue**

```vue
<template>
  <div id="home">
    <!-- 导航栏  -->
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>购物街</div>
      </template>
    </nav-bar>

    <!-- 滚动上方标签页 -->
    <page-tab-control class="tab-control"
                      v-show="isTabFixed"
                      :titles="['流行','新款','精选']"
                      @tabClick="tabClickHandler"/>

   <!-- 滚动区域  -->
   <scroll class="content"
           ref="scroll"
           :probe-type="3"
           :pull-up-load="true"
           @scroll="contentScroll"
           @pullingUp="loadMore">
     <!--  轮播图  -->
     <home-swiper :banners="banner.list" @swiperImageLoad="swiperImageLoadHandler"/>
     <!-- 商品推荐 -->
     <home-recommend :recommends="recommend.list"/>
     <!-- 本周流行 -->
     <home-popular/>
     <!-- 商品类别点击 -->
     <page-tab-control class="tab-control"
                       ref="tabControl"
                       :titles="['流行','新款','精选']"
                       @tabClick="tabClickHandler"/>
     <!-- 商品列表 -->
     <goods-list :goods="showGoods"/>
   </scroll>

    <!--
         回到顶部
         自定义组件的监听绑定事件: @click.native
    -->
    <back-top @click.native="backTopHandler" v-show="isShowBackTop"/>

  </div>
</template>

<script>
import {NEW, POP, SELL,BACK_TOP_DISTANCE} from "@/utils/const";
import {getHomeDataApi, getHomeGoodsApi} from "@/api/home";
import HomeSwiper from "@/views/modules/home/home-swiper";
import HomeRecommend from "@/views/modules/home/home-recommend";
import HomePopular from "@/views/modules/home/home-popular";
import PageTabControl from "@/views/page-tab-control";
import GoodsList from "@/views/modules/goods/goods-list";

export default {
  name: "home",
  components: {GoodsList, PageTabControl, HomePopular, HomeRecommend, HomeSwiper},
  data() {
    return {
      //主页轮播图数据
      banner: '',
      //商品推荐数据
      recommend: '',
      //页面标签控件默认选中项
      currentType: POP,
      //商品展示的数据
      goods: {
        [POP]: {page: 0, list: []},
        [NEW]: {page: 0, list: []},
        [SELL]: {page: 0, list: []},
      },
      //是否显示回到顶部按钮
      isShowBackTop: false,
      //滚动区域标签页元素到顶部的位置
      tabOffsetTop: 0,
      //是否显示滚动区域上方的标签页
      isTabFixed: false,
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  //组件调用后自动请求
  created() {
    //获取到所有数据才展示数据
    Promise.all([
      this.getHomeData(),
      this.getHomeGoods(POP),
      this.getHomeGoods(NEW),
      this.getHomeGoods(SELL),
    ])
  },
  //使用keep-alive组件被激活的状态下使用的生命周期钩子
  activated() {
    //重新进入时获取数据并定位
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
  },
  //使用keep-alive组件停止使用时调用
  deactivated() {
    //销毁时记录saveY的位置
    this.saveY = this.$refs.scroll.getScrollY()
  },
  methods: {
    /**
     * 事件监听的方法
     */
    // 切换商品类型数据
    tabClickHandler(index) {
      //当前商品的类型转换
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
          break;
      }
    },

    // 加载更多商品数据
    loadMore() {
      this.getHomeGoods(this.currentType);
    },

    // 滚动事件监听
    contentScroll(position) {
      // 判断是否显示 BackTop 组件
      this.isShowBackTop = (-position.y) > BACK_TOP_DISTANCE;

      // 如果当前位置比tabOffsetTop的位置大，则滚动区域上方的标签页吸附住
      this.isTabFixed = (-position.y) > this.tabOffsetTop;
    },

    // 回到顶部
    backTopHandler() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },

    // 判断轮播图是否加载完成并获取元素到顶部的位置
    swiperImageLoadHandler() {
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
    },

    /**
     * 网络请求的方法
     */
    // 获取主页轮播图和推荐数据
    getHomeData() {
      getHomeDataApi().then(res => {
        this.banner = res.data.banner;
        this.recommend = res.data.recommend;
      })
    },

    // 获取商品类型数据
    getHomeGoods(type) {
      //默认页面为0，需要在默认页面上 + 1
      const page = this.goods[type].page + 1;
      getHomeGoodsApi(type, page).then(res => {
        // 将请求到的数组数据深拷贝到对象数组中
        this.goods[type].list.push(...res.data.list);
        // res的分页数据会将设置的页面覆盖，所以要重新在页码 + 1
        this.goods[type].page += 1;
        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      })
    }
  }
}
</script>

<style scoped>
#home {
  /* 100的屏幕高度占比 */
  height: 100vh;
  position: relative;
}

.nav-bar {
  color: #FFF;
  font-weight: 700;
  background-color: var(--color-tint);
}

/* 设置better-scroll滚动的区域 */
.content {
  /*  取消滚动 */
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control {
  position: relative;
  z-index: 9;
}

</style>
```

## 三、商品详情



## 四、商品分类



## 五、购物车



六、项目总结

项目总结和遇到的问题





