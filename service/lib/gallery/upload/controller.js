const _ = require('lodash');
const { uploadImage, NOT_AN_IMAGE_FAILURE, OVERWRITING_NONEXISTENT_FILE_FAILURE } = require('./service');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const logger = require('../../logger');

const uploadController = async (req, res) => {

    if (!_.has(req, 'files.image')) {
        return res.status(BAD_REQUEST).send({
            error: 'form-data image is missing'
        });
    }

    const imageName = _.get(req, 'params.id');

    try {
        const uploadResult = await uploadImage(req.files.image, imageName);

        return res.send({
            imageId: uploadResult.id
        });
    } catch (err) {
        let errorCode = INTERNAL_SERVER_ERROR;
        let errorMessage = 'There was an error during uploading. Please try again.';

        logger.error(err);

        if (err.errorCode === NOT_AN_IMAGE_FAILURE || err.errorCode === OVERWRITING_NONEXISTENT_FILE_FAILURE) {
            errorCode = BAD_REQUEST;
            errorMessage = err.message;
        }

        return res.status(errorCode).send({
            error: errorMessage
        });
    }
};

module.exports = uploadController;