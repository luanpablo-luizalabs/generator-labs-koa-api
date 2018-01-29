const logger = require('../../middleware/log')

let Logger = (properties) => { }

Logger.log = async (data) => {
  if (!data) {
    return
  }

  if (data.env !== undefined) {
    data.app_env = data.env
    data.origin = 'app'
    delete data.env
  } else {
    data.env = process.env.NODE_ENV
  }

  logger.info(data)
}

module.exports = Logger
