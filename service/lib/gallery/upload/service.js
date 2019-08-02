const _ = require('lodash');
const { saveToStorage } = require('../../storage');
const { addImage } = require('../general');

const GENERAL_UPLOAD_FAILURE = 1;
const NOT_AN_IMAGE_FAILURE = 2;

const validMimetypes = [
    'image/png',
    'image/jpg',
    'image/jpeg'
];

const uploadImage = async (imageData) => {

    //check that file is actually an image
    if (!_.includes(validMimetypes, imageData.mimetype)) {
        const error = new Error('Uploaded file is not an image');
        error.errorCode = NOT_AN_IMAGE_FAILURE;
        throw error;
    }

    const saveResult = await saveToStorage(imageData);
    const name = saveResult.name;

    //hardcoded for now, as there may be more galleries with permissions required to access them
    const galleryId = 0;

    await addImage(galleryId, name);
    //TODO: delete in case of failure

    return {
        id: saveResult.name
    };
};

Object.assign(module.exports, {
    uploadImage,
    GENERAL_UPLOAD_FAILURE,
    NOT_AN_IMAGE_FAILURE
});