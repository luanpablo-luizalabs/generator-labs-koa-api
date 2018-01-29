const router = require('koa-router')()
const controller = require('./db.controller')

router.post('/migrate', controller.migrate)
router.post('/seeds', controller.seeds)

module.exports = router.routes()
