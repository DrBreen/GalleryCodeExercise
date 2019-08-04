const { getImages } = require('../general');

const getGallery = async (galleryId, offset, count) => {
    const images = await getImages(galleryId);

    if (!images) {
        return;
    }

    let returnedImages;

    if (offset !== undefined && count !== undefined) {
        returnedImages = images.slice(Math.max(0, offset), Math.min(offset + count, images.length));
    } else {
        returnedImages = images;
    }

    return {
        count: images.length,
        imageIds: returnedImages
    };
};

Object.assign(module.exports, {
    getGallery
});