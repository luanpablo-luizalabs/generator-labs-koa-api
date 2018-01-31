const R = require('ramda')
const config = require('config')
const pjson = require('../../package.json')
const bunyan = require('bunyan')
const streams = config.logs

R.forEach((stream) => {
  if (stream.stream && stream.enabled) {
    stream.stream = require('bunyan-logstash-tcp').createStream(stream.stream)
  }
}, streams)

if (process.env.NODE_ENV.toUpperCase() !== 'TEST') {
  streams.push({
    level: 'info',
    stream: process.stdout // log INFO and above to stdout
  })
}

const configLogger = {
  name: pjson.name,
  streams: streams,
  bztoken: config.burzum.token,
  env: process.env.NODE_ENV,
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err
  }
}

let logger

if (config.logging) {
  logger = bunyan.createLogger(configLogger)
} else {
  logger = () => {}
  logger.debug = () => {}
  logger.info = () => {}
  logger.warn = () => {}
  logger.error = () => {}
}

module.exports = logger
