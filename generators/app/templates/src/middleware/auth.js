const jwt = require('jsonwebtoken')
const config = require('config')
const fs = require('fs')
const Raven = require('../helpers/sentryLog')
const error = require('../helpers/responseHandler').errorHandler

const cert = fs.readFileSync(`${config.root}/keys/users.public.pem`, { encoding: 'utf8' })
const allowedRoutes = [
  '/',
  '/ping',
  '/ping/',
  '/health',
  '/health/'
]

module.exports = async (ctx, next) => {
  const authorization = ctx.request.header.authorization

  if (allowedRoutes.indexOf(ctx.url) > -1 || process.env.NODE_ENV === 'test') {
    return next()
  }

  try {
    ctx.user = await jwt.verify(authorization, cert)
    Raven.mergeContext({user: {userName: ctx.user.userName}})
    return next()
  } catch (err) {
    throw error.unauthorized()
  }
}
