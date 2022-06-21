'use strict';

// in terminal run Node basicAuthStr.js to generate a basic auth string to send in headers via REST client (thunder client).  

let { start, sequelize} = require('./src/server');

sequelize.sync()
  .then(() => console.log('successfully connected'))
  .catch((e) => console.error(e));

start();
