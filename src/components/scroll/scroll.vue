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
    // 下拉获取更多数据
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp()
    },
    // 数据刷新
    refresh() {
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
