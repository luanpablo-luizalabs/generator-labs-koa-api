const config = require('config')
const axios = require('axios')
const mount = require('koa-mount')
const parse = require('co-body')
const router = require('koa-router')()
const pjson = require('../package.json')

module.exports = (app) => {
  app.use(async (ctx, next) => {
    try {
      ctx.request.body = await parse(ctx)
    } catch (err) {}

    await next()
  })

  app.use(mount('/logs', require('./resources/logs')))
  app.use(mount('/db', require('./resources/db')))
  app.use(mount('/v1/examples', require('./resources/examples')))

  // pings
  app.use(router.get('/', async (ctx) => {
    ctx.body = []
    ctx.body = {
      version: pjson.version,
      uptime: process.uptime()
    }
    ctx.status = 200
  }).middleware())
  app.use(router.get('/ping', async (ctx) => {
    ctx.body = []
    ctx.status = 200
  }).middleware())

  // health check
  app.use(router.get('/health', async (ctx) => {
    let pings = []
    for (let name in config.apigee.pings) {
      let url = config.apigee.pings[name]

      if (!url) continue

      let response = await axios.get(url, {headers: {'Authorization': config.apigee.token}})

      pings.push({
        name: name,
        status: {
          code: response.status
        }
      })
    }

    ctx.body = {
      version: pjson.version,
      uptime: process.uptime(),
      apis: pings
    }
    ctx.status = 200
  }).middleware())
}
