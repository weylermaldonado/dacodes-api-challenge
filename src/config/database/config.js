module.exports = {
    development: {
      client: 'mysql',
      connection: {
        host: process.env.DATABASE_HOSTNAME,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_SCHEMA,
      },
      debug: true
    },
    test: {
      client: 'mysql',
      connection: {
        host: process.env.DATABASE_HOSTNAME,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_SCHEMA,
      },
    },
    production: {
      client: 'mysql',
      connection: {
        host: process.env.DATABASE_HOSTNAME,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_SCHEMA,
      },
    },
  };
  