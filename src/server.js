'use strict';

// 3rd party rss
const express = require('express');
const bcrypt = require('bcrypt');
const { Users } = require('./models');
const basicAuth = require('./middleware/basic');
const bearerAuth = require('./middleware/bearer');
const acl = require('./middleware/access-control');

// instantiate express with Singleton
const app = express();

const PORT = process.env.PORT || 3002;

// add json to request body
app.use(express.json());

// Process FORM input and add to request body
app.use(express.urlencoded({ extended: true }));


//SAME example from class-06 demo
app.post('/signup', async (req, res, next) => {
  req.body.password = await bcrypt.hash(req.body.password, 5);

  let user = await Users.create(req.body);
  res.status(200).send(user);
});

//SAME example from class-06 demo
app.get('/hello', basicAuth, (req, res, next) => {
  let { name } = req.query;
  console.log('auth proof', req.user.username);
  res.status(200).send(`Greetings ${name}! this route is now secured by Basic AUth!!!`);
});

// SAME example from class-07
app.get('/users', bearerAuth, async (req, res, next) => {
  console.log(req.user);
  let users = await Users.findAll({});
  let payload = {
    results: users,
    token: req.user.token,
  };
  res.send(payload);
});

// Use bearer middleware first to make sure you're a valid user
// If you are, it'll call next() and then the acl() middleware will run
// This middleware will see if your user has the correct permissions
// If so, it'll call next() and send you to the route handler itself
// If either of those fails, the middleware will call next("with an error"), stopping the user
app.get('/create', bearerAuth, acl('create'), (req, res) => {
  res.status(200).send('OK! I have create permissions');
});

app.get('/update', bearerAuth, acl('update'), (req, res) => {
  res.status(200).send('OK! I have update permissions');
});

app.get('/delete', bearerAuth, acl('delete'), (req, res) => {
  res.status(200).send('OK! I have delete permissions');
});

module.exports = {
  server: app,
  start: () => app.listen(PORT, console.log('server running on', PORT)),
};
