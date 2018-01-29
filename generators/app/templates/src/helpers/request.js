const axios = require('axios')
const axiosRetry = require('axios-retry')
const config = require('config')
const circularJSON = require('circular-json')
const logger = require('../resources/logs/log.model')

var client = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': config.apigee.token
  }
})

client.defaults.headers.common['Content-Type'] = 'application/json'
client.defaults.timeout = 5000

// request interceptor
client.interceptors.request.use(
  function (config) {
    // log before request is sent
    let configLog = {
      timeout: config.timeout,
      headers: config.headers,
      method: config.method,
      url: config.url,
      data: config.data,
      axiosRetry: config['axios-retry']
    }

    logger.log({
      type: 'request-interceptor',
      data: circularJSON.stringify(configLog)
    })

    return config
  },
  function (error) {
    // log when request error
    logger.log({
      type: 'request-error-interceptor',
      data: circularJSON.stringify(error)
    })

    return Promise.reject(error)
  }
)

// response interceptor
client.interceptors.response.use(function (response) {
  // log response data
  let responseLog = {
    status: response.status,
    statusText: response.statusText,
    config: response.config,
    data: response.data
  }

  logger.log({
    type: 'response-interceptor',
    data: circularJSON.stringify(responseLog)
  })

  return response
}, function (error) {
  // log when response error
  let errorLog = {
    config: error.config,
    code: error.code
  }
  logger.log({
    type: 'response-error-interceptor',
    data: circularJSON.stringify(errorLog)
  })

  return Promise.reject(error)
})

axiosRetry(client, { retries: config.request.retries })

module.exports = client
