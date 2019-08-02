const { queryOneFromCollection, replaceOneInCollection } = require('../../mongo-connector');
const { existsInStorage } = require('../../storage');

const collectionName = 'galleries';

const getGallery = async (galleryId) => await queryOneFromCollection(collectionName, { galleryId });

const getImages = async (galleryId) => {
    const gallery = await getGallery(galleryId);
    return gallery.images;
};

const addImage = async (galleryId, imageId) => {
    //TODO: add gallery if it's missing
    //TODO; add images if it's missing
    if (!await existsInStorage(imageId)) {
        throw new Error(`Trying to add non-existent image ${imageId} to gallery ${galleryId}`);
    }

    const gallery = await getGallery(galleryId);
    gallery.images.push(imageId);

    await replaceOneInCollection(collectionName, { galleryId }, gallery);
};

Object.assign(module.exports, {
    getImages,
    addImage
});