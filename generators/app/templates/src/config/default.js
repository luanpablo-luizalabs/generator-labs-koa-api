const path = require('path')
const env = process.env.NODE_ENV || 'development'
const root = path.join(__dirname, '..', '..')
require('dotenv').config({path: path.join(root, `.env-${env.toLowerCase()}`)})

// default config
var base = {
  env: env,
  root: root,
  port: process.env.PORT || 9000,
  knexDialect: process.env.KNEX_DIALECT || 'mysql2',
  logging: process.env.SHOULD_LOG === 'true', // default false
  db: {
    name: process.env.DB_NAME || '<%= projectUnderscoredName %>',
    username: process.env.DB_USERNAME || '<%= projectUnderscoredName %>',
    password: process.env.DB_PASSWORD || '<%= projectUnderscoredName %>',
    options: {
      dialect: process.env.DB_DIALECT || 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      debug: process.env.DB_DEBUG || false,
      logging: process.env.DB_LOGGING || undefined,
      pool: {
        max: process.env.DB_POOL_MAX || 20,
        min: process.env.DB_POOL_MIN || 5,
        idle: process.env.DB_POOL_IDLE || 10000
      }
    }
  },
  burzum: {
    token: process.env.BURZUM_TOKEN || ''
  },
  ip: process.env.IP || undefined,
  logType: process.env.LOG_TYPE || 'dev',
  logs: [{
    level: process.env.BURZUM_LOG_INFO || 'info',
    type: 'raw',
    enabled: process.env.BURZUM_ENABLED === 'true', // default false
    stream: {
      host: process.env.BURZUM_HOST || '',
      port: process.env.BURZUM_PORT || 5030,
      ssl_enable: process.env.BURZUM_SSL_ENABLED || false,
      ssl_key: process.env.BURZUM_SSL_KEY,
      ssl_cert: process.env.BURZUM_SSL_CERT,
      ca: ['./certificates/ca.crt'],
      max_connect_retries: process.env.BURZUM_MAX_RETRIES || -1,
      cbuffer_size: process.env.BURZUM_BUFFER_SIZE || 10
    }
  }],
  slack: {
    username: process.env.SLACK_USER || '<%= projectName %>-user',
    channels: {
      alerts: {
        url: process.env.SLACK_ALERTS_URL || '',
        name: process.env.SLACK_ALERTS_NAME || '#dev-<%= projectName %>'
      }
    }
  },
  sentry: {
    url: process.env.SENTRY_URL
  },
  apigee: {
    token: process.env.APIGEE_TOKEN,
    apis: {
      examples: process.env.EXAMPLES_API
    },
    pings: {
      examples: process.env.EXAMPLES_API_PING
    }
  },
  request: {
    retries: 3
  }
}

module.exports = base
