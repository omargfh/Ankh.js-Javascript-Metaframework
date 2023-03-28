// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const { loadEnvConfig } = require('@next/env')

const dev = process.env.NODE_ENV !== 'production';
const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} = loadEnvConfig('./', dev).combinedEnv

module.exports = {
  client: 'mysql',
  connection: {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT,
  },
  migrations: {
    directory: './knex/migrations',
  },
  seeds: {
    directory: './knex/seeds',
  }
};
