'use strict';

let { start } = require('./src/server');
let { sequelize } = require('./src/models');

sequelize.sync()
  .then(() => console.log('successfully connected'))
  .catch((e) => console.error(e));

start();
