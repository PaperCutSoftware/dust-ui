describe('auth', () => {
  const auth2Instance = {
    isSignedIn: {
      get: sinon.stub()
    },
    currentUser: {
      get: sinon.stub()
    }
  }
  const gapi = {
    load: sinon.stub().callsFake((what, cb) => cb()),
    auth2: {
      init: sinon.stub().resolves(undefined),
      getAuthInstance: sinon.stub().returns(auth2Instance)
    }
  }

  const store = {
    dispatch: sinon.stub()
  }
  const getAuth = () => require('inject-loader!@/auth')({
    '../store': store
  })

  let originalGapi
  before(() => {
    originalGapi = window.gapi
    window.gapi = gapi
  })
  after(() => {
    window.gapi = originalGapi
  })

  beforeEach(() => {
    auth2Instance.isSignedIn.get.reset()
    auth2Instance.currentUser.get.reset()
  })

  it("initiates Google's auth2 client", () => {
    return getAuth().authInit.then(() => {
      gapi.load.should.have.been.calledWith('auth2', sinon.match.func)
      gapi.auth2.init.should.have.been.calledWith({
        client_id: process.env.GOOGLE_CLIENT_ID,
        hosted_domain: process.env.AUTH_DOMAIN
      })
    })
  })

  describe('authReady', () => {
    it('should not dispatch "signIn" action if not signed in', () => {
      auth2Instance.isSignedIn.get.returns(false)
      return getAuth().authReady.then(() => {
        gapi.auth2.getAuthInstance.should.have.been.called
        auth2Instance.isSignedIn.get.should.have.been.called
        auth2Instance.currentUser.get.should.not.have.been.called
        store.dispatch.should.not.have.been.called
      })
    })
    it('dispatches "signIn" action if signed in', () => {
      let user = 'test-user'
      auth2Instance.isSignedIn.get.returns(true)
      auth2Instance.currentUser.get.returns(user)
      return getAuth().authReady.then(() => {
        auth2Instance.currentUser.get.should.have.been.called
        store.dispatch.should.have.been.calledWith('signIn', user)
      })
    })
  })

  describe('getAuthIdToken', () => {
    const googleUser = {
      getAuthResponse: sinon.stub(),
      reloadAuthResponse: sinon.stub()
    }

    beforeEach(() => {
      auth2Instance.currentUser.get.returns(googleUser)
      googleUser.getAuthResponse.reset()
      googleUser.reloadAuthResponse.reset()
    })

    it('resolves as null when not signed in', () => {
      auth2Instance.isSignedIn.get.returns(false)
      return getAuth().getAuthIdToken().then(token => {
        expect(token).to.be.null
        gapi.auth2.getAuthInstance.should.have.been.called
        auth2Instance.isSignedIn.get.should.have.been.called
        auth2Instance.currentUser.get.should.not.have.been.called
      })
    })

    it('resolves with the current token if not expired', () => {
      auth2Instance.isSignedIn.get.returns(true)
      let idToken = 'google-oauth-token'
      googleUser.getAuthResponse.returns({
        id_token: idToken,
        expires_at: Date.now() + 1000
      })
      return getAuth().getAuthIdToken().then(token => {
        expect(token).to.equal(idToken)
        auth2Instance.currentUser.get.should.have.been.called
        googleUser.getAuthResponse.should.have.been.called
        googleUser.reloadAuthResponse.should.not.have.been.called
      })
    })

    it('reloads the auth response for a new token if expired', () => {
      auth2Instance.isSignedIn.get.returns(true)
      let idToken = 'google-oauth-token'
      googleUser.getAuthResponse.returns({
        id_token: 'expired-token',
        expires_at: Date.now() - 1000
      })
      googleUser.reloadAuthResponse.resolves({
        id_token: idToken
      })
      return getAuth().getAuthIdToken().then(token => {
        expect(token).to.equal(idToken)
        auth2Instance.currentUser.get.should.have.been.called
        googleUser.getAuthResponse.should.have.been.called
        googleUser.reloadAuthResponse.should.have.been.called
      })
    })
  })
})
