// default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || './src/config'

// bootstrap server
const Koa = require('koa')
const config = require('config')
const axios = require('axios')
const app = new Koa()

axios.defaults.headers.common['Authorization'] = config.apigee.token
axios.defaults.headers.common['Content-Type'] = 'application/json'

require('./middleware/koa')(app)
require('./routes')(app)

// start server
if (!module.parent) {
  app.listen(config.port, config.ip, function () {
    console.log('Koa server listening on %d, in %s mode', config.port, config.env)
  })
}

// expose app
exports = module.exports = app
