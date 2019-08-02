const { pathForName, existsInStorage } = require('../../storage');

const getPathToImageWithId = async (name) => {
    if (!(await existsInStorage(name))) {
        return;
    }

    return pathForName(name);
};

Object.assign(module.exports, {
    getPathToImageWithId
});