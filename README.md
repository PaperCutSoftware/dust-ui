# DUST: Device Usage Tracker UI

DUST is a tool to track the usage of a fleet of devices in a shared environment. 

With DUST, you can:
 
* Add new devices, providing descriptive information on them, such:
  * hostname
  * brand
  * model
  * credentials
  * photo
  * ip
  * nickname
  * and more...
* Claim a device as a user to let others know which device is in use.
* Integrate a Slack bot with a Slack channel for group communication and convenient commands 
  (like */claim &lt;device&gt;*). 

> Made for PaperCut [Constructival 2016][1]

## Configuration

Add your own `config/prod.env.js` based on `config/prod.env.js.dist`.

### Authentication

DUST uses Google OAuth for authentication and authorisation. To begin,
[create a Google API Console project and client ID](https://developers.google.com/identity/sign-in/web/devconsole-project).

For development, only the `GOOGLE_CLIENT_ID` is required to enable authentication.
This may be used for both production and development environments.

The optional `AUTH_DOMAIN` may be configured to restrict users to a Google Apps domain.

### Production API

The `API_*` config keys let you specify the details of your production [DUST API](https://github.com/PaperCutSoftware/dust-api). For example

``` javascript
module.exports = {
  // ...
  API_SCHEME: '"https"',
  API_HOST: '"example.com"',
  API_BASE_PATH: '"/api"',
  API_PORT: '"443"',
  // ...
}
```

> Note: Due to restrictions in [Webpack's DefinePlugin](https://webpack.js.org/plugins/define-plugin/), configuration string values must have nested quotes or use `JSON.stringify('string-value')`.

## Build Setup

Pre-requisites:

* [Node.js](https://nodejs.org/)

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, checkout
the [guide](http://vuejs-templates.github.io/webpack/)
and [docs for vue-loader](http://vuejs.github.io/vue-loader).

[1]: https://blog.papercut.com/blog/2016/11/22/constructival-papercuts-first-global-hackathon/
