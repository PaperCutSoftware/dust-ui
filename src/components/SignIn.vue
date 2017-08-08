<!--
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
-->
<template>
  <section>
    <md-whiteframe md-elevation="4">
      <h4>Sign in with Google</h4>
      <div id="google-signin-btn"></div>
    </md-whiteframe>

    <md-dialog-prompt
      md-title="Slack Details"
      md-content="Please enter your slack username so we can send you notifications"
      md-ok-text="Save"
      md-cancel-text="Maybe later"
      value=""
      md-input-name="Slack username"
      md-input-placeholder="firstname.lastname"
      md-click-outside-to-close="false"
      md-esc-to-close="false"
      ref="slackDialog"
      @close="close"
      @input="save"
    >
    </md-dialog-prompt>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import {users} from '../resources'

  export default {
    computed: mapState(['apiUser']),
    methods: {
      onSignIn (user) {
        this.$store.dispatch('signIn', user).then(() => {
          if (this.apiUser.slack_username) {
            this.close('cancel')
          } else {
            this.$refs.slackDialog.open()
          }
        })
      },
      close (type) {
        if (type === 'cancel') {
          this.$router.push(this.$route.query.then || {name: 'devices'})
        }
      },
      save (slackUsername) {
        users.update({id: this.apiUser.id}, Object.assign(Object.create(null), this.apiUser, {
          slack_username: slackUsername
        })).then(() => {
          this.close('cancel')
        })
      }
    },
    mounted () {
      gapi.signin2.render('google-signin-btn', {
        theme: 'dark',
        onsuccess: this.onSignIn,
        onfailure () {
          this.$store.dispatch('emitError', 'Error signing in via Google')
        }
      })
    }
  }
</script>

<style scoped>
  .md-whiteframe {
    width: 50%;
    margin: auto;
    padding: 10px;
    text-align: center;
  }

  #google-signin-btn {
    display: flex;
    justify-content: center;
  }
</style>
