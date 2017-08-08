<!--
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
-->
<template>
  <span v-if="isAuthenticated">
    <md-avatar>
      <img :src="photoUrl">
    </md-avatar>
    {{apiUser.display_name}}
  </span>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapState(['apiUser', 'photoUrl']),
      ...mapGetters(['isAuthenticated'])
    }
  }
</script>
