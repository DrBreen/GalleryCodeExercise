const _ = require('lodash');
const logger = require('../../logger');
const { saveToStorage, deleteFromStorage } = require('../../storage');
const { addImage } = require('../general');

const NOT_AN_IMAGE_FAILURE = 2;

const validMimetypes = [
    'image/png',
    'image/jpeg'
];

const uploadImage = async (imageData, imageName) => {

    //check that file is actually an image
    //it would be much better to check actual data for type instead of relying on mimetype, but for now that will do
    if (!_.includes(validMimetypes, imageData.mimetype)) {
        const error = new Error('Uploaded file is not an image');
        error.errorCode = NOT_AN_IMAGE_FAILURE;
        throw error;
    }

    const saveResult = await saveToStorage(imageData.data, imageName);
    const name = saveResult.name;

    //if we're adding new image, we need to save it to mongo
    if (!imageName) {
        try {
            //hardcoded for now, as there may be more galleries with permissions required to access them
            const galleryId = 0;

            await addImage(galleryId, name);

            return {
                id: name
            };
        } catch (error) {
            error.failedImageName = name;

            logger.error('Failed to save uploaded image, rolling back changes');

            //in case of failure, delete file
            await deleteFromStorage(name);

            throw error;
        }
    } else {
        //in other case, if we succeeded in saving it, we're good and we can just return success response
        return {
            id: name
        };
    }
};

Object.assign(module.exports, {
    uploadImage,
    NOT_AN_IMAGE_FAILURE
});