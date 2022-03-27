<template>
  <div id="cart">

    <nav-bar class="nav-bar">
      <template v-slot:center>购物车({{cartCount}})</template>
    </nav-bar>

    <scroll id="cart-list" :probe-type="3">
      <div>
        <cart-list-item v-for="item in cartList" :key="item.id" :item-info="item"/>
      </div>
    </scroll>
    <cart-bottom/>
  </div>
</template>

<script>
import CartBottom from "@/views/modules/cart/cart-bottom";
import CartListItem from "@/views/modules/cart/cart-list-item";

export default {
  name: "cart",
  components: {CartListItem, CartBottom},
  computed: {

    cartList() {
      return this.$store.getters.cartList
    },
    cartCount() {
      return this.$store.getters.cartCount
    }
  }
}
</script>

<style scoped>
#cart {
  overflow: hidden;
  position: relative;
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}

#cart-list {
  position: absolute;
  top: 44px;
  bottom: 93px;
  width: 100%;

}

</style>
