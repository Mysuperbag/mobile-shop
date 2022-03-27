import Vue from 'vue'
import Vuex from 'vuex';

import getters from "@/store/getters";
import mutations from "@/store/mutations";
import actions from "@/store/actions";

Vue.use(Vuex);

const state = {
  cartList: []
}


const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})

export default store;
