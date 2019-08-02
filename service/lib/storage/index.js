const { writeFile, exists } = require('fs');
const { promisify } = require('util');
const uuid = require('uuid');

let storageLocation;

const initStorage = (location) => {
    storageLocation = location;
};

const saveToStorage = async (data) => {
    const actualData = data.data;

    let name = uuid();

    while (await existsInStorage(name)) {
        name = uuid();
    }

    const path = `${storageLocation}/${name}`;
    await promisify(writeFile)(path, actualData);

    return {
        name
    };
};

const existsInStorage = async (name) => {
    const path = `${storageLocation}/${name}`;
    return await promisify(exists)(path);
};

const deleteFromStorage = (name) => {

};

Object.assign(module.exports, {
    initStorage,
    saveToStorage,
    deleteFromStorage,
    existsInStorage
});