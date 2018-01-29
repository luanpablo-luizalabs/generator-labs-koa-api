const models = require('./log.model')

module.exports.log = async (ctx) => {
  models.log(ctx.request.body)
  ctx.body = {'status': 'OK'}
}
