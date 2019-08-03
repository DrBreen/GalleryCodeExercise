const ConnectedMongoClient = (mockData) => ({
    db: () => ({
        collection: () => ({
            find: mockData.find,
            findOne: mockData.findOne,
            replaceOne: mockData.replaceOne
        })
    }),

    close: () => {}
});

const MongoClient = (mockData) => ({
    connect: (url, options, callback) => {
        const mockConnectedMongoClient = ConnectedMongoClient(mockData);
        callback(null, mockConnectedMongoClient);
    }
});

const MongoClientLateSuccess = (mockData, succeedAfterTries) => {
    const mockedClient = {};

    mockedClient.connect = (url, options, callback) => {

        if (mockedClient.currentTry <= mockedClient.succeedAfterTries) {
            callback(
                new Error('You can\'t connect to me now!' +
                    `(${mockedClient.succeedAfterTries - mockedClient.currentTry} until success)`),
                null);

            mockedClient.currentTry++;

            return;
        }

        const mockConnectedMongoClient = ConnectedMongoClient(mockData);
        callback(null, mockConnectedMongoClient);
    };

    mockedClient.currentTry = 0;
    mockedClient.succeedAfterTries = succeedAfterTries;

    return mockedClient;
};

const UnconnectableMongoClient = () => {
    return {
        connect: (url, options, callback) => {
            callback(new Error('Thou shalt never connect to me!'), null);
        }
    }
};

const MongoConfig = {
    url: 'http://test.url',
    password: 'testPwd',
    user: 'testUsr',
    database: 'testDbName'
};

Object.assign(module.exports, {
    MongoClient,
    MongoConfig,
    MongoClientLateSuccess,
    UnconnectableMongoClient
});