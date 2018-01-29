const path = require('path')
const config = require('config')
const knexConfig = require(path.join(config.root, 'knexfile'))
const dbConfig = knexConfig[config.env]

const knex = require('knex')(dbConfig)

module.exports.migrate = async (properties) => {
  return knex.migrate.latest()
  .then((data) => {
    return data
  })
  .catch((err) => {
    return err
  })
}

module.exports.seeds = async (properties) => {
  return knex.seed.run()
  .then((data) => {
    return data
  })
  .catch((err) => {
    return err
  })
}
