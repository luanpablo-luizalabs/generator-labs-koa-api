const Raven = require('../helpers/sentryLog')
const pjson = require('../../package.json')
const responseHandler = require('../helpers/responseHandler')
const error = require('../helpers/responseHandler').errorHandler

/**
 * Method: Generate the standard api response
 */
module.exports = async (ctx, next) => {
  ctx.set('x-api-version', pjson.version)

  try {
    await next()
    if (ctx.status === 200) {
      ctx.body = responseHandler.successResponse(ctx)
    } else if (ctx.status === 404) {
      throw error.resourceNotFound()
    }
  } catch (err) {
    ctx.app.emit('error', err)
    let error
    try {
      error = responseHandler.errorHandler.errorResponse(err)
    } catch (ex) {
      error = responseHandler.errorHandler.errorResponse(
        responseHandler.errorHandler.internal(err)
      )
    }

    let request = {
      method: ctx.request.method,
      header: {
        host: ctx.request.header.host,
        url: ctx.request.url,
        authorization: ctx.request.header.authorization,
        query: ctx.query,
        params: ctx.params
      },
      body: ctx.request.body,
      bodyError: error.body
    }

    Raven.mergeContext(request)

    ctx.status = error.statusCode
    ctx.body = error.body
  }
}
