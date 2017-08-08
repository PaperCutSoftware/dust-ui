const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"localhost"',
  API_SCHEME: '"http"',
  API_PORT: '9090'
})
