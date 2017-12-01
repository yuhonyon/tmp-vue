import Vue from 'vue'
import Router from 'vue-router'
import lazyLoading from './lazyLoading'
import Layout from '@/components/layout/App'

Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/',
      name: 'Layout',
      component: Layout,
      redirect: '/login',
      children: [
        {
          name: '质控记录',
          path: '/qcRecord',
          component: lazyLoading('qcRecord', true)
        }
      ]
    }, {
      path: '/login',
      name: 'Login',
      component: lazyLoading('login', true)
    },
    {
      path: '/*',
      redirect: '/login'
    }
  ]
})
