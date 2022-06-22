'use strict';

const { Users } = require('../models');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    try {
      let token = req.headers.authorization.split(' ').pop();
      console.log('bearer middleware', token);
      let validUser = await Users.authenticateBearer(token);
      if (validUser){

        console.log('successful token verification');

        req.user = validUser;

        console.log('am i valid', validUser);
        next();
      }
    } catch(e) {
      next(e.message);
    }
  }
};
