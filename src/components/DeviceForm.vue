<!--
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
-->
<template>
  <md-dialog :md-open-from="openFrom" :md-close-to="closeTo" ref="dialog">
    <md-dialog-title>{{device ? 'Edit' : 'Create'}} device</md-dialog-title>
    <md-dialog-content>
      <form @submit.prevent="save" :id="formId">
        <md-input-container>
          <label>Brand</label>
          <md-input required v-model="editingDevice.brand"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Model</label>
          <md-input required v-model="editingDevice.model"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Nickname</label>
          <md-input required v-model="editingDevice.nickname"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Hostname</label>
          <md-input required v-model="editingDevice.hostname"></md-input>
        </md-input-container>
        <md-input-container>
          <label>IP</label>
          <md-input required v-model="editingDevice.ip"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Location</label>
          <md-input required v-model="editingDevice.location"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Admin URL</label>
          <md-input type="url" v-model="editingDevice.admin_url"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Admin username</label>
          <md-input v-model="editingDevice.admin_username"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Admin password</label>
          <md-input v-model="editingDevice.admin_password"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Wiki URL</label>
          <md-input type="url" v-model="editingDevice.wiki_url"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Manual URL</label>
          <md-input type="url" v-model="editingDevice.manual_url"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Photo URL</label>
          <md-input type="url" v-model="editingDevice.photo_url"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Comment</label>
          <md-textarea v-model="editingDevice.comment"></md-textarea>
        </md-input-container>
      </form>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-secondary" @click.native="close">Cancel</md-button>
      <md-button class="md-primary" type="submit" :form="formId">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  import { devices } from '../resources'

  const deviceTemplate = {
    brand: null,
    model: null,
    nickname: null,
    hostname: null,
    ip: null,
    admin_url: null,
    admin_username: null,
    admin_password: null,
    wiki_url: null,
    manual_url: null,
    photo_url: null,
    location: null,
    comment: null
  }

  export default {
    props: ['device', 'openFrom', 'closeTo'],
    data () {
      return {
        editingDevice: {}
      }
    },
    computed: {
      deviceId () {
        return this.device && this.device.id || null
      },
      formId () {
        return this.deviceId ? `editForm${this.deviceId}` : 'createDevice'
      }
    },
    methods: {
      open () {
        this.editingDevice = Object.assign(Object.create(null), deviceTemplate, this.device)
        this.$refs.dialog.open()
      },
      close () {
        this.$refs.dialog.close()
        this.editingDevice = {}
      },
      save () {
        devices[this.deviceId ? 'update' : 'save']({id: this.deviceId}, this.editingDevice).then(() => {
          this.$emit('saved', this.editingDevice)
          this.close()
        })
      }
    }
  }
</script>

<style scoped>
  form {
    min-width: 240px;
  }
  @media (min-width: 660px) {
    form {
      min-width: 500px;
    }
  }
  @media (min-width: 700px) {
    form {
      min-width: 560px;
    }
  }
  @media (min-width: 922px) {
    form {
      min-width: 800px;
    }
  }
</style>
