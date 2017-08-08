<!--
 * Copyright (c) 2017 PaperCut Software International Pty. Ltd.
 *
 * https://www.papercut.com
 *
 * Use of this source code is governed by an MIT license.
 * See the project's LICENSE file for more information.
-->
<template>
  <div id="app" class="container">
    <md-toolbar class="main-header md-dense">
      <md-button class="md-icon-button" @click.native="toggleLeftSideNav">
        <md-icon>menu</md-icon>
      </md-button>

      <h1 class="md-title">{{title}}</h1>

      <auth></auth>
      <auth-control></auth-control>
    </md-toolbar>

    <md-sidenav class="md-left main-sidebar" ref="leftSideNav">
      <md-toolbar class="md-large">
        <div class="md-toolbar-container" @click="home">
          <h3 class="md-title">DUST</h3>
          <p class="md-subhead"><strong>D</strong>evice <strong>US</strong>age <strong>T</strong>racker</p>
        </div>
      </md-toolbar>
      <md-list>
        <md-list-item @click.native="openCreateDialog" id="createBtn">
          <md-icon>add_circle</md-icon>
          <span>Create new device</span>
        </md-list-item>
      </md-list>

      <md-toolbar>
        <h4>External links</h4>
      </md-toolbar>
      <md-list>
        <md-list-item href="https://github.com/PaperCutSoftware/dust-api" target="_blank">
          <md-icon>code</md-icon>
          <span>DUST API Project</span>
        </md-list-item>
        <md-list-item href="https://github.com/PaperCutSoftware/dust-ui" target="_blank">
          <md-icon>code</md-icon>
          <span>DUST UI Project</span>
        </md-list-item>
      </md-list>
    </md-sidenav>

    <device-form ref="createForm" open-from="#createBtn" close-to="#createBtn"></device-form>

    <main>
      <router-view></router-view>
      <transition name="fade">
        <md-card class="api-error" v-if="errors.length > 0">
          <md-toolbar class="md-warn md-dense">
            <h2 class="md-title" style="flex: 1;">Error</h2>
            <md-button class="md-icon-button md-dense" @click.native="clearErrors">
              <md-icon>close</md-icon>
            </md-button>
          </md-toolbar>
          <md-card-content>
            <p v-for="error in errors" :key="error">{{error}}</p>
          </md-card-content>
        </md-card>
      </transition>
    </main>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Auth from './components/Auth.vue'
  import AuthControl from './components/AuthControl.vue'
  import DeviceForm from './components/DeviceForm.vue'

  export default {
    components: {
      Auth,
      AuthControl,
      DeviceForm
    },
    computed: {
      title () {
        return this.$route.meta.title
      },
      ...mapState(['errors'])
    },
    methods: {
      home () {
        this.$router.push({name: 'devices'})
      },
      toggleLeftSideNav () {
        this.$refs.leftSideNav.toggle()
      },
      clearErrors () {
        this.$store.commit('clearErrors')
      },
      openCreateDialog () {
        this.$refs.createForm.open()
      }
    }
  }
</script>

<style>
  .main-header .md-title {
    flex: 1;
  }

  .main-header > .md-button:first-child {
    margin-right: 0;
    margin-left: -8px;
  }

  .main-sidebar.md-sidenav .md-toolbar .md-toolbar-container {
    cursor: pointer;
  }

  .main-sidebar.md-sidenav .md-toolbar .md-toolbar-container:hover {
    color: #fff;
  }

  .main-sidebar.md-sidenav .md-toolbar .md-title {
    font-size: 24px;
  }

  .main-sidebar.md-sidenav .md-toolbar .md-title:after {
    content: ' - ';
    margin-right: 8px;
  }

  main {
    padding: 10px;
    position: relative;
  }

  main .api-error {
    position: fixed;
    top: 10px;
    right: 10px;
  }

  .text-right {
    text-align: right;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .md-theme-default .md-card .md-card-actions .md-icon-button.md-accent .md-icon,
  .md-theme-default .md-icon-button.md-accent .md-icon{
    color: inherit;
  }

  .md-list-item a.md-list-item-container {
    display: flex;
  }

  @media (min-width: 1280px) {
    .container {
      padding-left: 304px;
    }

    .main-header > .md-button:first-child {
      display: none;
    }

    .main-sidebar.md-sidenav .md-sidenav-content {
      transform: translateZ(0);
      top: 0;
      pointer-events: auto;
      box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12);
    }

    .main-sidebar.md-sidenav .md-toolbar {
      background-color: #fff;
      color: #333;
      border-bottom: 1px solid #ddd;
    }

    .main-sidebar.md-sidenav .md-toolbar .md-toolbar-container:hover {
      color: #2e7d32;
    }
  }
</style>
