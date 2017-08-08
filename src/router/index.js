/*
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { authReady } from '../auth'
import store from '../store'

// components
import SignIn from '../components/SignIn.vue'
import DeviceList from '../components/DeviceList.vue'
import DeviceDetails from '../components/DeviceDetails.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  meta: { public: true },
  beforeEnter (to, from, next) {
    authReady.then(() => {
      next({name: store.getters.isAuthenticated ? 'devices' : 'sign-in'})
    })
  }
}, {
  path: '/devices',
  name: 'devices',
  component: DeviceList,
  meta: {
    title: 'Device List'
  }
}, {
  path: '/devices/:id',
  name: 'device',
  component: DeviceDetails,
  meta: {
    title: 'Device Details'
  }
}, {
  path: '/sign-in',
  name: 'sign-in',
  component: SignIn,
  beforeEnter (to, from, next) {
    authReady.then(() => {
      if (store.getters.isAuthenticated) {
        next({ name: 'devices' })
      } else {
        next()
      }
    })
  },
  meta: {
    title: 'Sign in',
    public: true
  }
}]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  // if not authenticated and any matched route is non-public, redirect to sign-in
  if (to.matched.some(record => !record.meta.public)) {
    authReady.then(() => {
      if (store.getters.isAuthenticated) {
        next()
      } else {
        next({
          name: 'sign-in',
          query: { then: to.fullPath }
        })
      }
    })
  } else {
    next()
  }
})

export default router
