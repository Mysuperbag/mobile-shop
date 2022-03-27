import {
  ADD_COUNTER,
  ADD_TO_CART,
  DELETE_CART
} from "@/store/mutations-types";


const actions = {
  addCart({state, commit}, info) {
    return new Promise((resolve, reject) => {
      const oldInfo = state.cartList.find(item => item.id === info.id);

      if (oldInfo) {
        commit(ADD_COUNTER, oldInfo);
        resolve("当前商品数量 + 1")
      } else {
        commit(ADD_TO_CART, info);
        resolve("当前商品添加成功")
      }

    })
  },
  delCart({commit}, info) {
    return new Promise((resolve, reject) => {
      commit(DELETE_CART, info);
      resolve("当前商品删除成功");
    })
  }
}

export default actions;
