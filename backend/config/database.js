const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect:'mysql',
  host: 'localhost',
  username: process.env.username,
  password: process.env.password,
  database: process.env.db_name,
});

module.exports = sequelize;
