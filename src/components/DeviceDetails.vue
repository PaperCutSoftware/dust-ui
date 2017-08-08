<!--
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
-->
<template>
  <md-card>
    <md-card-media v-if="device.photo_url">
      <img :src="device.photo_url" :alt="device.brand + ' ' + device.model">
    </md-card-media>

    <md-card-header>
      <div class="md-title">{{device.model}}</div>
      <div class="md-subhead">{{device.brand}}</div>
    </md-card-header>

    <md-card-content>
      <dl>
        <dt>Nickname</dt>
        <dd>{{device.nickname}}</dd>
        
        <dt>Hostname</dt>
        <dd>{{device.hostname}}</dd>

        <dt>IP</dt>
        <dd>{{device.ip}}</dd>

        <dt>Location</dt>
        <dd>{{device.location}}</dd>

        <dt v-if="device.admin_url">Admin</dt>
        <dd v-if="device.admin_url">
          <a target="_blank" :href="device.admin_url">{{device.admin_url}}</a>
        </dd>

        <dt v-if="device.admin_username">Admin username</dt>
        <dd v-if="device.admin_username">{{device.admin_username}}</dd>

        <dt v-if="device.admin_password">Admin password</dt>
        <dd v-if="device.admin_password">{{device.admin_password}}</dd>

        <dt v-if="device.wiki_url">Wiki</dt>
        <dd v-if="device.wiki_url">
          <a target="_blank" :href="device.wiki_url">{{device.wiki_url}}</a>
        </dd>

        <dt v-if="device.manual_url">Manual</dt>
        <dd v-if="device.manual_url">
          <a target="_blank" :href="device.manual_url">{{device.manual_url}}</a>
        </dd>

        <dt>Comment</dt>
        <dd>{{device.comment}}</dd>
      </dl>
      <dl v-if="device.claimed_by">
        <dt>Claimed by</dt>
        <dd>{{device.claimed_by}}</dd>
      </dl>
    </md-card-content>

    <md-card-actions>
      <md-button @click.native="back">Back</md-button>
      <device-claim-button :device="device"></device-claim-button>
      <md-button class="md-icon-button"
                 :class="{'md-accent': watched}"
                 @click.native="toggleWatch">
        <md-icon>star</md-icon>
      </md-button>
      <md-button class="md-icon-button"
                 id="editBtn"
                 @click.native="openEditDialog">
        <md-icon>edit</md-icon>
      </md-button>
    </md-card-actions>

    <device-form :device="device" ref="editForm"
                 @saved="device = arguments[0]"
                 open-from="#editBtn" close-to="#editBtn"></device-form>

  </md-card>
</template>

<script>
  import { devices, profile } from '../resources'
  import store from '../store'
  import DeviceClaimButton from './DeviceClaimButton.vue'
  import DeviceForm from './DeviceForm.vue'

  export default {
    data () {
      return {
        device: {},
        watches: []
      }
    },
    components: {
      DeviceClaimButton,
      DeviceForm
    },
    computed: {
      watched () {
        return ~this.watches.indexOf(this.device.id)
      }
    },
    methods: {
      back () {
        this.$router.push({name: 'devices'})
      },
      toggleWatch () {
        let idx = this.watches.indexOf(this.device.id)
        if (idx !== -1) {
          profile.unwatch({deviceId: this.device.id}).then(() => {
            this.watches.splice(idx, 1)
          })
        } else {
          profile.watch({}, {device_id: this.device.id}).then(() => {
            this.watches.push(this.device.id)
          })
        }
      },
      openEditDialog () {
        this.$refs.editForm.open()
      }
    },
    beforeRouteEnter (to, from, next) {
      let promise
      if (to.query.claim) {
        promise = devices.claim({id: to.params.id}, {}).catch(() => {
          store.dispatch('emitError', 'Could not claim device')
        })
      } else {
        promise = Promise.resolve()
      }
      promise.then(() => {
        devices.get({ id: to.params.id }).then(res => res.json()).then(device => {
          next(vm => {
            vm.device = device
          })
        }, () => {
          next(false)
        })
      })
    },
    created () {
      profile.watches().then(res => res.json()).then(watches => {
        this.watches = watches.map(watch => watch.device_id)
      })
    },
    watch: {
      $route () {
        this.device = {}
        devices.get({id: this.$route.params.id}).then(res => res.json()).then(data => {
          this.device = data
        })
      }
    }
  }
</script>

<style scoped>
  .md-card {
    max-width: 800px;
  }
  .md-card .md-card-media img {
    max-width: 350px;
  }
  .claim-button.md-button {
    width: auto;
    height: auto;
    min-height: 32px;
    min-width: 88px;
  }

  dl {
    margin: 0 0 10px;
  }

  dt {
    font-weight: bold;
    font-size: 90%;
    position: relative;
    padding-bottom: 2px;
    margin-bottom: 5px;
  }
  dt:after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 0;
    width: 75%;
    height: 1px;
    background: #999;
    background: linear-gradient(to right, #999 0%, transparent 100%);
  }

  dd {
    white-space: pre-wrap;
    margin: 0 0 10px;
    padding: 0;
    line-height: 1.1;
  }
</style>
