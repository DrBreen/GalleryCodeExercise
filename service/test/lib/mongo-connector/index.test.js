const { initMongo, isConnected, disconnect } = require('../../../lib/mongo-connector');
const {
    UnconnectableMongoClient,
    MongoConfig,
    MongoClientLateSuccess,
    MongoClient
} = require('../../helpers/mock-mongo-client');
const { expect } = require('chai');

describe('lib.mongo-connector', () => {

    describe('initMongo', () => {

        beforeEach(() => {
            disconnect();
        });

        it('Should fail after several retries if it can\'t connect', async () => {
            try {
                await initMongo(UnconnectableMongoClient(), MongoConfig, {
                    maxRetries: 5,
                    retryInterval: 100,
                    exponentialFalloff: false
                });
            } catch (err) {
                expect(isConnected()).to.equal(false);
            }
        });

        it('Should connect after several retries if it can\'t connect during first tries but succeeds on next ones', async () => {
            await initMongo(MongoClientLateSuccess({}, 5), MongoConfig, {
                maxRetries: 10,
                retryInterval: 100,
                exponentialFalloff: false
            });

            expect(isConnected()).to.equal(true);
        });

        it('Should connect successfully', async () => {
            await initMongo(MongoClient({}), MongoConfig, {
                maxRetries: 1,
                retryInterval: 100,
                exponentialFalloff: false
            });

            expect(isConnected()).to.equal(true);
        });

    });

});