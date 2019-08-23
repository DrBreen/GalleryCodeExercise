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
            ],
            comments: {}
        };
    }

    await replaceOneInCollection(collectionName, { galleryId }, gallery);
};

const saveComment = async (galleryId, imageId, comment) => {

    const gallery = await getGallery(galleryId);
    if (!gallery) {
        throw new Error(`Trying to add comment for non-existent gallery ${galleryId}`);
    }

    const images = await getImages(galleryId);

    if (!images.includes(imageId)) {
        throw new Error(`Trying to add comment for non-existent image ${imageId} in gallery ${galleryId}`);
    }

    gallery.comments[imageId] = comment;

    await replaceOneInCollection(collectionName, { galleryId }, gallery);
};

const loadComments = async (galleryId) => {
    const gallery = await getGallery(galleryId);
    return gallery.comments;
};

Object.assign(module.exports, {
    getImages,
    addImage,
    saveComment,
    loadComments
});