const router = require('koa-router')()
const controller = require('./log.controller')

router.post('/', controller.log)

module.exports = router.routes()
