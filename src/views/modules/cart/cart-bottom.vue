<template>
  <div class="bottom-menu">
    <check-button class="select-all" @checkBtnClick="checkAllClick" v-model="isSelectAll"/>
    <span>全选</span>
    <span class="total-price">合计: ¥{{ totalPrice }}</span>
    <span class="buy-product">去结算({{ $store.getters.cartCount }})</span>
  </div>
</template>

<script>
import CheckButton from "@/views/modules/cart/check-button";

export default {
  name: "cart-bottom",
  components: {CheckButton},
  computed: {
    // 获取总价格
    totalPrice() {
      // 获取 store 中的 cartList
      const cartList = this.$store.getters.cartList;

      // 过滤 cartList 选中的数据并计算总价格
      return cartList.filter(item => {
        return item.checked;
      }).reduce((value, item) => {
        return value + item.count * item.newPrice;
      }, 0).toFixed(2);
    },

    // 是否选中
    isSelectAll() {
      return this.$store.getters.cartList.find(item => item.checked === false) === undefined;
    }
  },
  methods: {
    checkAllClick() {
      //返回没有checked的boolean
      let selectAllFlag = this.$store.getters.cartList.find(item => !item.checked);

      if (selectAllFlag) {
        this.$store.state.cartList.forEach(item => {
          item.checked = true;
        })
      } else {
        this.$store.state.cartList.forEach(item => {
          item.checked = false;
        })
      }

    }
  }
}
</script>
<style scoped>
.bottom-menu {
  width: 100%;
  height: 44px;
  background-color: #eee;
  position: fixed;
  bottom: 48px;
  left: 0;
  box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
  font-size: 14px;
  color: #888;
  line-height: 44px;
  padding-left: 35px;
  box-sizing: border-box;
}

.bottom-menu .select-all {
  position: absolute;
  line-height: 0;
  left: 12px;
  top: 13px;
}

.bottom-menu .total-price {
  margin-left: 15px;
  font-size: 16px;
  color: #666;
}

.bottom-menu .buy-product {
  background-color: orangered;
  color: #fff;
  width: 100px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  float: right;
}
</style>
