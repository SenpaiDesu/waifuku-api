const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const api = require('./routes');
//const { checkToken } = require('./services/auth.service');

const app = express();

app
  .use(morgan('dev'))
  .use(express.static(`${__dirname}/public`))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded( {extended: true }))
  .use('/api', api)
  .use('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
  });

module.exports = app;