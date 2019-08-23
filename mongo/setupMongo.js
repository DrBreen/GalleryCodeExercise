conn = new Mongo("localhost:27017");

load('/etc/exc_svc/sec/credentials.js');

excDb = conn.getDB('exc');

excDb.createCollection('galleries');

//create R/W user if it's missing
if (excDb.getUser(credentials.user) === null) {
    excDb.createUser(
        {
            user: credentials.user,
            pwd: credentials.pwd,
            roles: [
                {
                    role: "readWrite",
                    db: "exc"
                }
            ]
        }
    );
} else {
    print("R/W user is already created");
}

//create default gallery
excDb.galleries.insertOne({
    "galleryId": 0,
    "images" : [],
    "comments" : {}
});

