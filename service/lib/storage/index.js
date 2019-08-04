const { writeFile, exists, unlink } = require('fs');
const { promisify } = require('util');
const uuid = require('uuid');
const { join } = require('path');

let storageLocation;

const pathForName = (name) => {
    return join(storageLocation, name);
};

const initStorage = (location) => {
    storageLocation = location;
};

const saveToStorage = async (data, providedName) => {

    if (providedName && !await existsInStorage(providedName)) {
        throw new Error(`Can only replace existing image - ${providedName} does not exist`);
    }

    let name;
    if (!providedName) {
        name = uuid();

        while (await existsInStorage(name)) {
            name = uuid();
        }
    } else {
        name = providedName;
    }

    const path = pathForName(name);
    await promisify(writeFile)(path, data);

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