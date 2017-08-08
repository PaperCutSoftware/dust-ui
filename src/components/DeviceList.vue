<!--
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
-->
<template>
  <md-table-card>
    <md-toolbar class="md-transparent">
      <h3 class="md-title">Devices</h3>

      <md-input-container md-inline>
        <label>Search</label>
        <md-input v-model.trim="searchTerm"></md-input>
      </md-input-container>

      <md-button class="md-icon-button" :disabled="loading" @click.native="fetchDeviceList">
        <md-icon>refresh</md-icon>
      </md-button>
    </md-toolbar>

    <spinner :loading="loading" :color="'#009688'" style="margin:10px auto;"></spinner>

    <!-- Filter control goes here -->
    <md-table v-if="deviceList.length > 0" @sort="onSort">
      <md-table-header>
        <md-table-row>
          <md-table-head md-sort-by="brand">Brand</md-table-head>
          <md-table-head>Model</md-table-head>
          <md-table-head md-sort-by="location">Location</md-table-head>
          <md-table-head>Device Admin</md-table-head>
          <md-table-head>Available</md-table-head>
          <md-table-head>Watch</md-table-head>
          <md-table-head>&nbsp;</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="device in deviceList" :key="device.id" :md-item="device">
          <md-table-cell>{{device.brand}}</md-table-cell>
          <md-table-cell>
            <router-link :to="{name: 'device', params: { id: device.nickname } }">
              {{device.model}}
            </router-link>
          </md-table-cell>
          <md-table-cell>{{device.location}}</md-table-cell>
          <md-table-cell>
            <a v-if="device.admin_url" :href="device.admin_url" target="_blank">
              {{device.hostname}}
            </a>
            <span v-else>{{device.hostname}}</span>
          </md-table-cell>
          <md-table-cell>
            <md-icon :class="{'md-warn': !!device.claimed_by_id, 'md-primary': !device.claimed_by_id}">
              {{!!device.claimed_by_id ? 'do_not_disturb_alt' : 'check_circle'}}
            </md-icon>
            <small v-if="device.claimed_by">{{device.claimed_by}}</small>
          </md-table-cell>
          <md-table-cell>
            <md-button class="md-icon-button"
                       :class="{'md-accent': ~watches.indexOf(device.id)}"
                       @click.native="toggleWatch(device)">
              <md-icon>star</md-icon>
            </md-button>
          </md-table-cell>
          <md-table-cell md-numeric>
            <device-claim-button :device="device"></device-claim-button>
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
  </md-table-card>
</template>

<script>
  import {devices, profile} from '../resources'
  import Spinner from 'vue-spinner/src/BounceLoader.vue'
  import DeviceClaimButton from './DeviceClaimButton.vue'

  export default {
    data () {
      return {
        loading: true,
        sort: {
          name: 'brand',
          type: 'asc'
        },
        devices: [],
        watches: []
      }
    },
    computed: {
      searchTerm: {
        get () {
          return this.$store.state.searchTerm
        },
        set (term) {
          this.$store.commit('setSearchTerm', {term})
        }
      },
      deviceList () {
        const terms = this.searchTerm.length ? this.searchTerm.toLowerCase().split(/\s+/) : []
        return this.devices.filter(device => {
          if (terms.length === 0) {
            return true
          }
          const indexString = `${device.brand} ${device.model} ${device.nickname} ${device.location} ${device.claimed_by}`.toLowerCase()
          return terms.every(term => {
            let neg = false
            if (term.charAt(0) === '-') {
              neg = true
              term = term.slice(1)
            }
            if (term.length === 0) {
              return true
            }
            const idx = indexString.indexOf(term)
            return neg ? idx === -1 : idx !== -1
          })
        }).sort((a, b) => {
          return this.sort.type === 'asc'
            ? a[this.sort.name].localeCompare(b[this.sort.name])
            : b[this.sort.name].localeCompare(a[this.sort.name])
        })
      }
    },
    components: {
      Spinner,
      DeviceClaimButton
    },
    methods: {
      onSort (sort) {
        this.sort = sort
      },
      fetchDeviceList () {
        this.loading = true
        this.devices = []
        return devices.query().then(res => res.json()).then(devices => {
          this.loading = false
          this.devices = devices
        }).catch(() => {
          this.loading = false
        })
      },
      toggleWatch (device) {
        let idx = this.watches.indexOf(device.id)
        if (idx !== -1) {
          profile.unwatch({deviceId: device.id}).then(() => {
            this.watches.splice(idx, 1)
          })
        } else {
          profile.watch({}, {device_id: device.id}).then(() => {
            this.watches.push(device.id)
          })
        }
      }
    },
    mounted () {
      this.fetchDeviceList().then(() => {
        return profile.watches().then(res => res.json()).then(watches => {
          this.watches = watches.map(watch => watch.device_id)
        })
      })
    }
  }
</script>

<style>
  .md-table-cell small {
    flex: 1;
    margin-left: 4px;
  }

  .md-table .md-table-cell.md-numeric.md-has-action .md-table-cell-container {
    justify-content: flex-end;
  }

  .md-table .md-table-cell-container .md-icon {
    margin: inherit;
  }

  .md-table .md-table-cell .md-button .md-icon {
    margin: auto;
  }

  .md-table-card .md-toolbar .md-input-container {
    flex-basis: 25%;
  }
</style>
