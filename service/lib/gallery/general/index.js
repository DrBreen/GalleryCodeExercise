const { queryOneFromCollection, replaceOneInCollection } = require('../../mongo-connector');
const { existsInStorage } = require('../../storage');

const collectionName = 'galleries';

const getGallery = async (galleryId) => await queryOneFromCollection(collectionName, { galleryId });

const getImages = async (galleryId) => {
    const gallery = await getGallery(galleryId);

    if (!gallery) {
        return;
    }

    return gallery.images;
};

const addImage = async (galleryId, imageId) => {
    if (!await existsInStorage(imageId)) {
        throw new Error(`Trying to add non-existent image ${imageId} to gallery ${galleryId}`);
    }

    let gallery = await getGallery(galleryId);
    if (gallery) {
        gallery.images.push(imageId);
    } else {
        gallery = {
            galleryId,
            images: [
                imageId
            ]
        };
    }

    await replaceOneInCollection(collectionName, { galleryId }, gallery);
};

Object.assign(module.exports, {
    getImages,
    addImage
});