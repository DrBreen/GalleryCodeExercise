const { writeFile, exists, unlink } = require('fs');
const { promisify } = require('util');
const uuid = require('uuid');

let storageLocation;

const pathForName = (name) => {
    return `${storageLocation}/${name}`;
};

const initStorage = (location) => {
    storageLocation = location;
};

const saveToStorage = async (data) => {
    const actualData = data.data;

    let name = uuid();

    while (await existsInStorage(name)) {
        name = uuid();
    }

    const path = pathForName(name);
    await promisify(writeFile)(path, actualData);

    return {
        name
    };
};

const existsInStorage = async (name) => {
    return await promisify(exists)(pathForName(name));
};

const deleteFromStorage = async (name) => {
    await promisify(unlink)(pathForName(name));
};

Object.assign(module.exports, {
    initStorage,
    saveToStorage,
    deleteFromStorage,
    existsInStorage,
    pathForName
});