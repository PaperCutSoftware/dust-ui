<!--
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
-->
<template>
  <md-button v-if="isAuthenticated" @click.native="signOut">
    Sign out
  </md-button>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    computed: mapGetters(['isAuthenticated']),
    methods: {
      signOut () {
        this.$store.dispatch('signOut').then(() => {
          this.$router.push({name: 'sign-in'})
        })
      }
    }
  }
</script>
