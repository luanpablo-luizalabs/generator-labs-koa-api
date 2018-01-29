const R = require('ramda')
const Raven = require('../helpers/sentryLog')
const logger = require('../middleware/log')
const koaLogger = require('koa-bunyan-logger')
const slackNotifier = require('../helpers/slack.js')
const error = require('../helpers/responseHandler').errorCatalog

module.exports = (app) => {
  app.use(koaLogger(logger))
  app.use(koaLogger.requestIdContext())
  app.use(
    koaLogger.requestLogger({

      // custom fields for both request and response
      updateResponseLogFields: (ctx, err) => {
        if (ctx.res) {
          let body = (ctx.res.body && ctx.res.body.dataValues) || ctx.res.body
          // the line below does:
          // if body is an array, create an obj only with non undefined values and return or the body itself
          body = Array.isArray(body) ? R.map(obj => !R.isNil(obj.dataValues) ? obj.dataValues : obj, body) : body
          if (typeof body === 'object') {
            // limiting registers
            if (Array.isArray(body) && body.length > 50) {
              ctx.body = []
            } else {
              ctx.body = body
            }
          } else {
            ctx.text = body
          }
        }
      }
    })
  )

  // transform all responses to Apigee pattern
  // sets x-api-version in headers
  app.use(require('./pre-response'))
  app.use(require('./auth'))

  app.on('error', (err) => {
    logger.info(err)

    // avoids logging to slack on 400 and 404
    if ((err.data === undefined) || (err.output.statusCode !== 401 && err.data.errorCode !== error.recordNotFound && err.data.errorCode !== error.badRequest && err.data.errorCode !== error.badRequestUniqueViolation && err.data.errorCode !== error.resourceNotFound && !err.data.isJoi)) {
      if (!err.channels) {
        err.channels = ['alerts']
      }

      let requestData = Raven.getContext()
      Raven.captureException(err, {extra: requestData})

      slackNotifier.error(err)
    }
  })
}
