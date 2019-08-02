const { writeFile, exists } = require('fs');
const { promisify } = require('util');
const uuid = require('uuid');

let storageLocation;

const initStorage = (location) => {
    storageLocation = location;
};

const save = async (data) => {
    const actualData = data.data;

    let name = uuid();
    let alreadyExists = true;

    let path;

    while (alreadyExists) {
        path = `${storageLocation}/${name}`;
        alreadyExists = await promisify(exists)(path);

        if (alreadyExists) {
            name = uuid();
        }
    }

    await promisify(writeFile)(path, actualData);

    return {
        name
    };
};

const deleteFromStorage = (name) => {

};

Object.assign(module.exports, {
    initStorage,
    save,
    deleteFromStorage
});