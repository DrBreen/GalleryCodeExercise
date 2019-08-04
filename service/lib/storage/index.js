const { writeFile, exists, unlink } = require('fs');
const { promisify } = require('util');
const uuid = require('uuid');
const { join } = require('path');

const OVERWRITING_NONEXISTENT_FILE_ERROR = 1;

let storageLocation;

const pathForName = (name) => {
    return join(storageLocation, name);
};

const initStorage = (location) => {
    storageLocation = location;
};

const saveToStorage = async (data, providedName) => {

    if (providedName && !await existsInStorage(providedName)) {
        const error = new Error(`Can only replace existing image - ${providedName} does not exist`);
        error.errorCode = OVERWRITING_NONEXISTENT_FILE_ERROR;
        throw error;
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
    pathForName,
    OVERWRITING_NONEXISTENT_FILE_ERROR
});