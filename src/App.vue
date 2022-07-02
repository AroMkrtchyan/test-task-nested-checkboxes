<template>
  <div id="app">
    <custom-select
      :selectData="selectData"
      :getSelectedProducts="getSelectedProducts"
      @change="selectHandler"
      @clear="clearHandler"
    />
  </div>
</template>

<script>
import data from "./json-data/data.json";
import { mapMutations, mapGetters } from "vuex";

import CustomSelect from "./components/CustomSelect.vue";
export default {
  name: "main-application",
  components: {
    CustomSelect,
  },
  computed: {
    ...mapGetters(["getSelectedProducts"]),
    selectData() {
      return data;
    },
  },
  methods: {
    ...mapMutations(["SET_SELECTED_PRODUCTS"]),
    selectHandler(value) {
      this.SET_SELECTED_PRODUCTS(value);
    },
    clearHandler() {
      this.CLEAR_SELECTED_PRODUCTS();
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  padding: 25px;
  display: flex;
  justify-content: center;
}
</style>
