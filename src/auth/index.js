/*
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
 */
import store from '../store'

export const authInit = new Promise((resolve) => {
  gapi.load('auth2', () => {
    const auth2 = gapi.auth2.init({
      client_id: process.env.GOOGLE_CLIENT_ID,
      hosted_domain: process.env.AUTH_DOMAIN
    })

    auth2.then(() => {
      resolve()
    })
  })
})

export const authReady = authInit.then(() => {
  const auth2 = gapi.auth2.getAuthInstance()
  if (auth2.isSignedIn.get()) {
    return store.dispatch('signIn', auth2.currentUser.get())
  }
})

export const getAuthIdToken = () => authInit.then(() => {
  const auth2 = gapi.auth2.getAuthInstance()
  if (auth2.isSignedIn.get()) {
    const googleUser = auth2.currentUser.get()
    const authResponse = googleUser.getAuthResponse()
    if (authResponse.expires_at > Date.now()) {
      return authResponse.id_token
    } else {
      return googleUser.reloadAuthResponse().then(newAuthResponse => newAuthResponse.id_token)
    }
  } else {
    return null
  }
})
