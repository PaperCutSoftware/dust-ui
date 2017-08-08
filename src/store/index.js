/*
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { authInit } from '../auth'
import { profile } from '../resources'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiUser: null,
    photoUrl: null,
    searchTerm: localStorage.getItem('searchTerm') || '',
    errors: []
  },
  getters: {
    isAuthenticated (state) {
      return typeof state.apiUser === 'object' && state.apiUser !== null
    }
  },
  mutations: {
    setApiUser (state, {user}) {
      state.apiUser = user
    },
    setPhotoUrl (state, {photoUrl}) {
      state.photoUrl = photoUrl
    },
    setSearchTerm (state, {term}) {
      state.searchTerm = term
      localStorage.setItem('searchTerm', term)
    },
    pushError (state, {message}) {
      state.errors = state.errors.concat(message)
    },
    clearErrors (state) {
      state.errors = []
    }
  },
  actions: {
    signIn ({commit}, googleUser) {
      commit('setPhotoUrl', {photoUrl: googleUser.getBasicProfile().getImageUrl()})
      return profile.get().then(res => res.json()).then(apiUser => {
        commit('setApiUser', {user: apiUser})
      })
    },
    signOut ({commit}) {
      return authInit.then(() => {
        return gapi.auth2.getAuthInstance().signOut().then(() => {
          commit('setApiUser', {user: null})
          commit('setPhotoUrl', {photoUrl: null})
        })
      })
    },
    emitError ({commit}, message) {
      commit('pushError', {message})
      setTimeout(() => {
        commit('clearErrors')
      }, 8000)
    },
    emitApiError ({dispatch}, response) {
      dispatch('emitError', `${response.status} ${response.statusText} (${response.url})`)
    }
  }
})
