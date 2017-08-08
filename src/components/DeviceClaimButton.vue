<!--
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
-->
<template>
  <md-button v-if="isAuthenticated" class="claim-button md-raised md-dense"
             :class="{'md-primary': device.claimed_by_id !== apiUser.id, 'md-warn': device.claimed_by_id === apiUser.id}"
             :disabled="disabled"
             @click.native="toggleClaim">
    <span v-if="device.claimed_by_id !== apiUser.id">
      Claim
    </span>
    <span v-else>
      Unclaim
    </span>
  </md-button>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {devices} from '../resources'

  export default {
    props: ['device'],
    data () {
      return {
        busy: false
      }
    },
    computed: {
      ...mapState(['apiUser']),
      ...mapGetters(['isAuthenticated']),
      disabled () {
        return this.busy || (this.device.claimed_by_id !== null && this.device.claimed_by_id !== this.apiUser.id)
      }
    },
    methods: {
      toggleClaim () {
        this.busy = true
        const promise = this.device.claimed_by_id === null ? this.claimDevice() : this.freeDevice()
        promise.then(() => {
          this.busy = false
        })
      },
      claimDevice () {
        return devices.claim({id: this.device.id}, {}).then(() => {
          this.device.claimed_by_id = this.apiUser.id
          this.device.claimed_by = this.apiUser.display_name
        }, () => {
          this.$store.dispatch('emitError', 'Could not claim device')
        })
      },
      freeDevice () {
        return devices.free({id: this.device.id}).then(() => {
          this.device.claimed_by_id = null
          this.device.claimed_by = null
        }, () => {
          this.$store.dispatch('emitError', 'Could not unclaim device')
        })
      }
    }
  }
</script>

<style scoped>
  .claim-button.md-button {
    width: auto;
    height: auto;
    min-height: 32px;
    min-width: 88px;
  }
</style>
