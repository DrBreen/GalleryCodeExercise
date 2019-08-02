const { queryOneFromCollection } = require('../../mongo-connector');

const collectionName = 'galleries';

const getGallery = async (galleryId) => {
    return await queryOneFromCollection(collectionName, {
        galleryId
    });
};

Object.assign(module.exports, {
    getGallery
});