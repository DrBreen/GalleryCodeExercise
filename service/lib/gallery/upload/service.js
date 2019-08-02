const _ = require('lodash');
const { save } = require('../../storage');

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

    const saveResult = await save(imageData);

    //TODO: save to mongo
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