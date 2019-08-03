const express = require('express');
const middlewareLogger = require('morgan');
const { promisify } = require('util');
const { MongoClient } = require('mongodb');

const fs = require('fs');
const router = require('./routes');
const { initMongo } = require('./mongo-connector');
const { initStorage } = require('./storage');
const logger = require('./logger');

let server;

const getServer = () => {
    return server;
};

if (!process.env.MONGO_CONFIG_LOCATION) {
    logger.error('No Mongo config provided');
    process.exit(1);
}

if (!process.env.STORAGE_LOCATION) {
    logger.error('No storage location provided');
    process.exit(1);
}

const configLocation = process.env.MONGO_CONFIG_LOCATION;
const storageLocation = process.env.STORAGE_LOCATION;

//read Mongo config file, then initialize Mongo
//upon initializing Mongo, fire up HTTP server
promisify(fs.readFile)(configLocation).then((jsonData) => {
    const mongoConfig = JSON.parse(jsonData);
    return mongoConfig;
}).then((mongoConfig) => {
    return Promise.all([initMongo(MongoClient, mongoConfig)]);
}).then(() => {
    initStorage(storageLocation);

    logger.info(`Successfully connected to Mongo DB`);

    const app = express();
    app.use(middlewareLogger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);

    const port = process.env.PORT || 3000;
    app.listen(port, () => logger.info(`gallery running on ${port}`));
}).catch((err) => {
    logger.error(`Failed to start up gallery due to ${err}, trace: ${err.stack}`);
    process.exit(1);
});

Object.assign(module.exports, {
    getServer
});


