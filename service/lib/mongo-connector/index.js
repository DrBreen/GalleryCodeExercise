const { promisify } = require('util');
const logger = require('../logger');

const sleep = promisify(setTimeout);

const maxRetries = 10;
let retryInterval = 500;

let config;
let mongoClient;

const initMongo = async (client, mongoConfig) => {
    if (!mongoConfig.url) {
        throw new Error("url is missing from mongo params");
    }

    if (!mongoConfig.password) {
        throw new Error("url is missing from mongo params");
    }

    if (!mongoConfig.user) {
        throw new Error("user is missing from mongo params");
    }

    if (!mongoConfig.database) {
        throw new Error("database is missing from mongo params");
    }

    config = mongoConfig;

    const url = `mongodb://${encodeURIComponent(config.user)}:${encodeURIComponent(config.password)}@${config.url}/${config.database}`;

    let retriesLeft = maxRetries;
    let currentRetryInterval = retryInterval;

    const tryConnecting = async () => {
        while(retriesLeft > 0) {
            try {
                mongoClient = await promisify(client.connect)(url, {
                    useNewUrlParser: true
                });

                break;
            } catch (err) {
                logger.warn(`Can't connect to Mongo due to ${err}, retries left: ${retriesLeft}`);

                retriesLeft--;
                currentRetryInterval = 2 * currentRetryInterval;

                if (retriesLeft === 0) {
                    throw err;
                } else {
                    await sleep(currentRetryInterval);
                    await tryConnecting();
                }
            }
        }
    };

    await tryConnecting();
};

const currentDb = () => {
    return mongoClient.db(config.database);
};

const queryFromCollection = async (collection, query) => {
    return await currentDb().collection(collection).find(query, { projection: { _id: 0 }}).toArray();
};

const queryOneFromCollection = async (collection, query) => {
    return await currentDb().collection(collection).findOne(query, { projection: { _id: 0 }});
};

const replaceOneInCollection = async (collection, query, object) => {
    return await currentDb().collection(collection).replaceOne(query, object, { upsert: true });
};

Object.assign(module.exports, {
    initMongo,
    queryFromCollection,
    queryOneFromCollection,
    replaceOneInCollection
});

