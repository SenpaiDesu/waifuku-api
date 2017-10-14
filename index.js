const app = require('./app');
const mongoose = require('mongoose');
const cluster = require('cluster');
const {
  PORT,
  DB_CONNECTION_STRING
} = require('./config');

mongoose.Promise = global.Promise;

mongoose.connect(DB_CONNECTION_STRING, { useMongoClient: true })
  .then(() => {
    app.listen(PORT, err => {
      if (!err) console.log(`Server runs on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });