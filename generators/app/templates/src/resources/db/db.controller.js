const models = require('./db.model')
const error = require('../../helpers/responseHandler').errorHandler

module.exports.migrate = async (ctx) => {
  let response = await models.migrate()
  if (response.code) {
    throw error.internal(response)
  }
  ctx.body = response
}

module.exports.seeds = async (ctx) => {
  let response = await models.seeds()
  if (response.code) {
    throw error.internal(response)
  }
  ctx.body = response
}
