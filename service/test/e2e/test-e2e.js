const proxyquire = require('proxyquire');
const path = require('path');
const request = require('supertest');

const { MongoClient } = require('../helpers/mock-mongo-client');

const { promisify } = require('util');
const sleep = promisify(setTimeout);

describe('Test server E2E', () => {

    let server;
    beforeEach(() => {
        process.env.MONGO_CONFIG_LOCATION = path.join(__dirname, 'fixtures', 'credentials.json');
        process.env.STORAGE_LOCATION = '/test/mongo/location';
        process.env.PORT = 9999;
        process.env.DEBUG = true;

        //fire up the server
        const { getServer } = proxyquire('../../lib/server', {
            'mongodb': {
                MongoClient: MongoClient({})
            }
        });

        while (!server) {
            server = getServer();
            sleep(1000);
        }

    });

    afterEach(() => {

    });




});