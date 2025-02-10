const initOptions = {};

const pgp = require('pg-promise')(initOptions);

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'rest-api',
  user: 'rest-api',
  password: 'admin',
  max: 30 // use up to 30 connections
};

const db = pgp(cn);

export default {pgp, db}