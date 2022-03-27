import {
  ADD_COUNTER,
  ADD_TO_CART,
  DELETE_CART
} from "@/store/mutations-types";

/**
 * mutations唯一的目的就是修改state中的状态
 * mutations中每个方法实现的功能尽量比较单一
 *
 * @type {{addCartCount(*, *): void, addToCart(*, *=): void}}
 */
const mutations = {
  // 购物车数量+1
  [ADD_COUNTER](state, cartInfo) {
    cartInfo.count += 1;
  },
  // 加入购物车
  [ADD_TO_CART](state, cartInfo) {
    cartInfo.count = 1;
    cartInfo.checked = true
    state.cartList.push(cartInfo);
  },
  // 删除购物车
  [DELETE_CART](state, cartInfo) {
    state.cartList = state.cartList.filter(cart => {
      if (cart.id !== cartInfo.id) {
        return cart;
      }
    });
  }
};

export default mutations;
