const ConnectedMongoClient = (mockData) => ({
    db: () => ({
        collection: () => ({
            find: mockData.find,
            findOne: mockData.findOne,
            replaceOne: mockData.replaceOne
        })
    })
});

const MongoClient = (mockData) => {
    return {
        connect: (url, options, callback) => {
            const mockConnectedMongoClient = ConnectedMongoClient(mockData);
            callback(null, mockConnectedMongoClient);
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
    MongoConfig
});