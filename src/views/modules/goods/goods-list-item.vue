<template>
  <div class="goods" @click="goodsDetail(goodsItem)">
    <img v-lazy="image" :src="image" :alt="goodsItem.title">
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
      // this.$router.push({
      //   path: '/goods/',
      //   query:{
      //     id
      //   }
      // });
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
