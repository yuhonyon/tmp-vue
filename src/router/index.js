import Vue from 'vue'
import Router from 'vue-router'
import lazyLoading from './lazyLoading'
import Layout from '@/components/layout/Layout'

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
          name: '病人管理',
          path: '/patientManage',
          component: lazyLoading('patientManagement', true)
        },
        {
          name: '医院管理',
          path: '/hospitalManage',
          component: lazyLoading('hospitalManagement', true)
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
