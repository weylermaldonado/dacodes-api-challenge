const { Model } = require('objection');
const Knex = require('knex');

const config = require('./config')[process.env.NODE_ENV];

const knex = Knex(config);

Model.knex(knex);
