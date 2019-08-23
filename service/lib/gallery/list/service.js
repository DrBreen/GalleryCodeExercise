const { getImages, loadComments } = require('../general');

const getGallery = async (galleryId, offset, count) => {
    const imagesOriginal = await getImages(galleryId);

    if (!imagesOriginal) {
        return;
    }

    const images = imagesOriginal.reverse();

    let returnedImages;

    if (offset !== undefined && count !== undefined) {
        returnedImages = images.slice(Math.max(0, offset), Math.min(offset + count, images.length));
    } else {
        returnedImages = images;
    }

    const comments = await loadComments(galleryId);

    return {
        count: images.length,
        imageIds: returnedImages,
        comments
    };
};

Object.assign(module.exports, {
    getGallery
});