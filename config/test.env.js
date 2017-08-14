var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  GOOGLE_CLIENT_ID: '"test-google-client-id"',
  AUTH_DOMAIN: '"example.com"'
})
