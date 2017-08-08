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
