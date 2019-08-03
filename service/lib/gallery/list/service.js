const { getImages } = require('../general');

const getGallery = async (galleryId, offset, count) => {
    const images = await getImages(galleryId);

    let returnedImages;

    if (offset !== undefined && count !== undefined) {
        returnedImages = images.slice(Math.max(0, offset), Math.min(offset + count, images.length));
    } else {
        returnedImages = images;
    }

    return returnedImages;
};

Object.assign(module.exports, {
    getGallery
});