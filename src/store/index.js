import user from './user';
import hospital from './hospital';
import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    hospital
  }
})

export default store;
