<template>
  <div id="detail">
    <goods-detail-nav-bar class="detail-nav" :current-index="currentIndex" @itemClick="titleClick(index)"/>
    <scroll class="content" ref="scroll" :probe-type="3" :pull-up-load="true" @scroll="contentScroll">
      <goods-detail-swiper :top-images="topImages"/>
      <goods-detail-base ref="base" :goods="goods"/>
      <goods-detail-shop :shop="shop"/>
      <goods-detail-info :info="info" @imageLoad="imageLoadHandler"/>
      <goods-detail-param ref="param" :param="param"/>
      <goods-detail-comment ref="comment" :comment="comment"/>
      <goods-detail-recommend ref="recommend" :recommends="recommends"/>
    </scroll>
    <back-top class="back-top" @backTop="backTop" v-show="isShowBackTop"/>
    <goods-detail-bottom @addToCart="addToCartHandler"/>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import {Goods, Shop, GoodsParam, getGoodsDetailApi, getRecommendApi} from "@/api/goods";
import {backTopMixin} from "@/mixins/mixin";
import {BACK_TOP_DISTANCE} from "@/utils/const";
import GoodsDetailSwiper from "@/views/modules/goods/goods-detail-swiper";
import GoodsDetailNavBar from "@/views/modules/goods/goods-detail-nav-bar";
import GoodsDetailShop from "@/views/modules/goods/goods-detail-shop";
import GoodsDetailBase from "@/views/modules/goods/goods-detail-base";
import GoodsDetailInfo from "@/views/modules/goods/goods-detail-info";
import GoodsDetailParam from "@/views/modules/goods/goods-detail-param";
import GoodsDetailComment from "@/views/modules/goods/goods-detail-comment";
import GoodsDetailRecommend from "@/views/modules/goods/goods-detail-recommend";
import GoodsDetailBottom from "@/views/modules/goods/goods-detail-bottom";

export default {
  name: "goods-detail",
  mixins: [backTopMixin],
  components: {
    GoodsDetailBottom,
    GoodsDetailRecommend,
    GoodsDetailComment,
    GoodsDetailParam,
    GoodsDetailInfo,
    GoodsDetailShop,
    GoodsDetailBase,
    GoodsDetailSwiper,
    GoodsDetailNavBar
  },
  data() {
    return {
      id: null,
      topImages: [],
      goods: {},
      shop: {},
      info: {},
      param: {},
      comment: {},
      recommends: [],
      currentIndex: 0,
      //4个offsetTop的值
      themeTops: []
    };
  },
  created() {
    this.id = this.$route.params.id;
    Promise.all([
      this.getGoodsDetail(this.id),
      this.getRecommend()
    ])
  },
  updated() {
    // 获取需要的四个offsetTop
    this.getOffsetTops();
  },
  methods: {
    ...mapActions(['addCart']),
    /**
     * 事件监听
     */
    //添加购物车
    addToCartHandler() {
      const product = {};


      product.id = this.id;
      product.imgURL = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.newPrice = this.goods.realPrice;

      // store同步的方法
      // this.$store.commit('addCart', product)

      // store异步的方法 返回Promise
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })


      // mapActions方法方法里添加映射   import {mapActions} from 'vuex'
      // 数组方式:只可以使用原先方法的名字 ...mapActions(['addCart'])
      // 对象方式:命名对象重新命名方法名字 ...mapActions({addGoods: 'addCart'}),
      this.addCart(product).then(res => {
        this.$toast.showHandler(res, 2000)
      })


    },
    //如果图片加载成功则重新刷新滚动条
    imageLoadHandler() {
      this.$refs.scroll.refresh()
    },
    //滚动条事件监听
    contentScroll(position) {
      //监听backTop显示
      this.isShowBackTop = position.y < -BACK_TOP_DISTANCE;
      //监听滚动到哪一个主题
      this.listenScrollTheme(-position.y);
    },

    //监听navbar的位置
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTops[index], 100)
    },

    //监听滚动与navbar的位置关系
    listenScrollTheme(position) {
      for (let i = 0; i < this.themeTops.length; i++) {
        let iPosition = this.themeTops[i];
        /**
         * 判断的方案:
         *  方案一:
         *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
         *    优点: 不需要引入其他的内容, 通过逻辑解决
         *    缺点: 判断条件过长, 并且不容易理解
         *  方案二:
         *    条件: 给themeTops最后添加一个很大的值, 用于和最后一个主题的top进行比较.
         *    优点: 简洁明了, 便于理解
         *    缺点: 需要引入一个较大的int数字
         * 疑惑: 在第一个判断中, 为什么不能直接判断(currentPos >= iPos)即可?
         * 解答: 比如在某一个currentPos大于第0个时, 就会break, 不会判断后面的i了.
         */
        if (position >= iPosition && position < this.themeTops[i + 1]) {
          if (this.currentIndex !== i) {
            this.currentIndex = i;
          }
          break;
        }
      }
    },

    // 获取需要的四个offsetTop
    getOffsetTops() {
      this.themeTops = []
      this.themeTops.push(this.$refs.base.$el.offsetTop)
      this.themeTops.push(this.$refs.param.$el.offsetTop)
      this.themeTops.push(this.$refs.comment.$el.offsetTop)
      this.themeTops.push(this.$refs.recommend.$el.offsetTop)
      this.themeTops.push(Number.MAX_VALUE)
    },
    /**
     * 网络请求
     */
    //获取推荐商品信息
    getRecommend() {
      getRecommendApi().then((res, error) => {
        if (error) return
        this.recommends = res.data.list;
      });
    },
    //获取商品信息
    getGoodsDetail(id) {
      getGoodsDetailApi(id).then(res => {
        const data = res.result;

        // 获取商品轮播图信息
        this.topImages = data.itemInfo.topImages;

        // 获取商品基本信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 获取商品店家信息
        this.shop = new Shop(data.shopInfo)

        // 获取商品详细信息
        this.info = data.detailInfo;

        // 获取商品参数信息
        this.param = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 获取商品评论信息
        if (data.rate.list) {
          this.comment = data.rate.list[0];
        }
      })
    }
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  /* z-index 正数是在上方，负数在下方*/
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  /* 取消滚动 */
  overflow: hidden;
  position: absolute;
  /* 计算bs的滚动位置 */
  height: calc(100% - 44px);
}

.back-top {
  position: fixed;
  right: 10px;
  bottom: 65px;
}
</style>
