const { getImages } = require('../general');

const getGallery = async (galleryId) => {
    return await getImages(galleryId);
};

Object.assign(module.exports, {
    getGallery
});