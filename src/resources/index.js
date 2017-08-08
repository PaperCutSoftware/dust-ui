/*
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
 */
import Vue from 'vue'
import VueResource from 'vue-resource'
import store from '../store'
import { getAuthIdToken } from '../auth'

Vue.use(VueResource)

let apiRoot = ''
if (!!process.env.API_SCHEME && !!process.env.API_HOST) {
  apiRoot += process.env.API_SCHEME + '://' + process.env.API_HOST
}
if (!!process.env.API_PORT &&
  !(process.env.API_SCHEME === 'http' && process.env.API_PORT === 80) &&
  !(process.env.API_SCHEME === 'https' && process.env.API_PORT === 443)) {
  apiRoot += ':' + process.env.API_PORT
}
apiRoot += process.env.API_BASE_PATH
Vue.http.options.root = apiRoot

Vue.http.interceptors.push((request, next) => {
  getAuthIdToken().then(token => {
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    next(response => {
      if (!response.ok) {
        store.dispatch('emitApiError', response)
      }
    })
  })
})

export const users = Vue.resource('users{/id}')

export const devices = Vue.resource('devices{/id}', {}, {
  claim: {
    method: 'POST',
    url: 'devices{/id}/claims'
  },
  free: {
    method: 'DELETE',
    url: 'devices{/id}/claims'
  }
})

export const profile = Vue.resource('profile', {}, {
  watches: {
    method: 'GET',
    url: 'profile/watches'
  },
  watch: {
    method: 'POST',
    url: 'profile/watches'
  },
  unwatch: {
    method: 'DELETE',
    url: 'profile/watches{/deviceId}'
  }
})
