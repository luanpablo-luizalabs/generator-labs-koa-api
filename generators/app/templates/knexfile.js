let dialect = require('config').knexDialect
let db = require('config').db

const dbConfig = {
  client: dialect,
  connection: {
    host: db.options.host,
    port: db.options.port,
    database: db.name,
    user: db.username,
    password: db.password
  },
  pool: {
    min: db.options.pool.min,
    max: db.options.pool.max
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}

module.exports = {
  test: dbConfig,
  development: dbConfig,
  stage: dbConfig,
  production: dbConfig
}
