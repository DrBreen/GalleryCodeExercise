const { writeFile } = require('fs');
const { promisify } = require('util');
const uuid = require('uuid');
const mimeTypes = require('mime-types');

let storageLocation;

const initStorage = (location) => {
    storageLocation = location;
};

const save = async (data) => {
    const mimetype = data.mimetype || '';
    const actualData = data.data;
    const extension = mimeTypes.extension(mimetype);

    //TODO: check if exists with same path
    const name = uuid();
    let path = `${storageLocation}/${name}`;
    if (extension) {
        path = `${path}.${extension}`
    }

    await promisify(writeFile)(path, actualData);

    //now let's detect the file type
    return {
        name
    };
};

const getType = async (name) => {

};

const deleteFromStorage = (name) => {

};

Object.assign(module.exports, {
    initStorage,
    save,
    getType,
    deleteFromStorage
});