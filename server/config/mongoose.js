const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');

const config = require('./config');

// const mongoUri = config.mongo.host;
mongoose.set('useFindAndModify', false);

// Connect to MongoDB
mongoose
  // .connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true })
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mean", { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

