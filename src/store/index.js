import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedProducts: [],
  },
  getters: {
    getSelectedProducts: (store) => store.selectedProducts,
  },
  mutations: {
    SET_SELECTED_PRODUCTS(store, payload) {
      store.selectedProducts = payload;
    },
  },
});
