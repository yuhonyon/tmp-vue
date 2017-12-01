import './config'
import Vue from 'vue'
import App from './App'
<%if(config.vuex){%>
import router from './router'
<%}%>
<%if(config.router){%>
import router from './router'
import NProgress from 'nprogress'
<%}%>
import * as filters from './filters';
import api from './store/api';

import {
  mapGetters,
  mapActions,
  mapMutations,
  mapState
} from 'vuex'

import './styles/main.<%=config.style.includes("sass")?"scss":(config.style.includes("less")?"less":"css")%>';

<%if(config.router&&config.vuex){%>
  import { sync } from 'vuex-router-sync';
  const unsync = sync(store, router)
<%}%>


Vue.config.productionTip = false

<%if(config.vuex){%>
  window.mapGetters=mapGetters;
  window.mapActions=mapActions;
  window.mapMutations=mapMutations;
<%}%>


window.fetchApi=api;

export default  new Vue({
  el: '#app',
  <%=config.router?"router,":""%>
  <%=config.vuex?"store,":""%>
  template: '<App/>',
  components: { App }
})


<%if(config.router){%>
router.beforeEach((to, from, next) => {
// if (to.path == '/login') {
//     localStorage.removeItem('username');
//   }
// let user = localStorage.getItem('user');
// if (!user && to.path != '/login') {
//     next({path: '/login'})
//   } else {
    NProgress.start();
    next()
// }
});
router.afterEach(transition => {
  NProgress.done();
});
<%}%>



Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
