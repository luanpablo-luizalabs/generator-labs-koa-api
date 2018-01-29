const Raven = require('raven')
const config = require('config')

Raven.config(config.sentry.url).install()

module.exports = Raven
