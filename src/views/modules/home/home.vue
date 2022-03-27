<template>
  <div id="home">
    <!--  导航栏  -->
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>购物街</div>
      </template>
    </nav-bar>

    <!--  嵌套的一层   -->
    <page-tab-control class="tab-control"
                      v-show="isTabFixed"
                      :titles="['流行','新款','精选']"
                      @tabClick="tabClickHandler"/>

    <!--  滚动组件  -->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            :pull-up-load="true"
            @scroll="contentScroll"
            @pullingUp="loadMore">
      <!-- 轮播图 -->
      <home-swiper :banners="banner.list" @swiperImageLoad="swiperImageLoadHandler"/>

      <!-- 商品推荐 -->
      <home-recommend :recommends="recommend.list"/>

      <!-- 本周流行 -->
      <home-popular/>

      <!-- 商品点击 -->
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
import HomeSwiper from "@/views/modules/home/home-swiper";
import HomeRecommend from "@/views/modules/home/home-recommend";
import HomePopular from "@/views/modules/home/home-popular";
import PageTabControl from "@/views/page-tab-control";
import GoodsList from "@/views/modules/goods/goods-list";
import {
  getHomeDataApi,
  getHomeGoodsApi
} from "@/api/home";
import {NEW, POP, SELL, BACK_TOP_DISTANCE} from "@/utils/const";

export default {
  name: "home",
  components: {
    GoodsList,
    PageTabControl,
    HomePopular,
    HomeRecommend,
    HomeSwiper
  },
  data() {
    return {
      banner: '',
      recommend: '',
      goods: {
        [POP]: {page: 0, list: []},
        [NEW]: {page: 0, list: []},
        [SELL]: {page: 0, list: []}
      },
      currentType: POP,
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      savaY: 0
    }
  },
  computed: {
    // 当前展示商品详情的计算属性
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  created() {
    //获取到所有数据才展示数据
    Promise.all([
      this.getHomeData(),
      this.getHomeGoods(POP),
      this.getHomeGoods(NEW),
      this.getHomeGoods(SELL),
    ])
  },
  // updated() {
  //   this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
  //   console.log(this.tabOffsetTop);
  // },
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
  mounted() {
    /*
    *     1.使用防抖函数，减少请求
    *     2.使用总线组件用户多层级组件通信
    *         Vue.prototype.$bus = new Vue()
    *     3.在轮播图上绑定@load="imageLoad"方法
    *     4.通过总线组件提交方法
    *           imageLoad() {
    *             this.$bus.$emit('itemImageLoad')
    *           },
    *     5.总线接收方法并刷新数据
    * */
    // const refresh = debounce(this.$refs.scroll.refresh, 50)
    // this.$bus.$on('itemImageLoad', () => {
    //   refresh()
    // })
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
      // this.$refs.tab1.currentIndex = index;
      // this.$refs.tab2.currentIndex = index;
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
        // 下次更新DOM时,获取新的tabOffsetTop值(不保险,可以在updated钩子中获取)
        // this.$nextTick(() => {
        //   this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
        // })
      })
    },

    // 获取商品类型数据
    getHomeGoods(type) {
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


  },

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

/* 样式的计算 */
/*
.center {
  height: calc(100% - 10px);
  overflow: hidden;
  margin-bottom: 44px;
}
*/

</style>
