describe('App.vue', () => {
  let App
  let instance = {
    $route: {
      meta: {
        title: 'This is the title'
      }
    },
    $router: {
      push: sinon.spy()
    },
    $store: {
      commit: sinon.spy()
    },
    $refs: {
      leftSideNav: {
        toggle: sinon.spy()
      },
      createForm: {
        open: sinon.spy()
      }
    }
  }

  beforeEach(() => {
    let appInjector = require('!!vue-loader?inject!@/App.vue')
    App = appInjector({
      './components/Auth.vue': {},
      './components/AuthControl.vue': {},
      './components/DeviceForm.vue': {}
    })
  })

  describe('computed', () => {
    it('title should be set from route meta-data', () => {
      expect(App.computed.title.call(instance))
        .to.equal(instance.$route.meta.title)
    })
  })

  describe('methods', () => {
    it('home pushes the "devices" route', () => {
      App.methods.home.call(instance)
      instance.$router.push.should.have.been.calledWith({name: 'devices'})
    })

    it('toggleLeftSideNav calls leftSideNav.toggle', () => {
      App.methods.toggleLeftSideNav.call(instance)
      instance.$refs.leftSideNav.toggle.should.have.been.called
    })

    it('clearErrors commits to store', () => {
      App.methods.clearErrors.call(instance)
      instance.$store.commit.should.have.been.calledWith('clearErrors')
    })

    it('openCreateDialog calls createForm.open', () => {
      App.methods.openCreateDialog.call(instance)
      instance.$refs.createForm.open.should.have.been.called
    })
  })
})
