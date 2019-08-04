const proxyquire = require('proxyquire');
const { expect } = require('chai');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('http-status-codes');

let uploadImage;
const SUT = proxyquire('../../../../lib/gallery/upload/controller', {
    './service' : {
        uploadImage: async (...args) => await uploadImage(...args)
    }
});
const { NOT_AN_IMAGE_FAILURE, OVERWRITING_NONEXISTENT_FILE_FAILURE } = require('../../../../lib/gallery/upload/service');
const { createResponse } = require('../../../helpers/express-response');

describe('lib.gallery.upload.controller', () => {

    beforeEach(() => {
        uploadImage = null;
    });

    it('Should fail when there\'s no image attached to request', async () => {
        const response = createResponse();

        await SUT({}, response);

        expect(response.lastStatus).to.equal(BAD_REQUEST);
        expect(response.lastResponse).to.deep.equal({ error: 'form-data image is missing' });
    });

    it('Should respond with error 400 when sending non-image file', async () => {
        const response = createResponse();

        const testErrorMessage = 'not an image error test';
        uploadImage = async () => {
            const error = new Error(testErrorMessage);
            error.errorCode = NOT_AN_IMAGE_FAILURE;
            throw error;
        };

        await SUT({
            files: {
                image: 'test'
            }
        }, response);

        expect(response.lastStatus).to.equal(BAD_REQUEST);
        expect(response.lastResponse).to.deep.equal({ error: testErrorMessage });
    });

    it('Should respond with error 400 when overwriting non-existent file', async () => {
        const response = createResponse();

        const testErrorMessage = 'overwriting non existent file error test';
        uploadImage = async () => {
            const error = new Error(testErrorMessage);
            error.errorCode = OVERWRITING_NONEXISTENT_FILE_FAILURE;
            throw error;
        };

        await SUT({
            files: {
                image: 'test',
                mimetype: 'image/jpeg'
            },
            params: {
                id: 'test'
            }
        }, response);

        expect(response.lastStatus).to.equal(BAD_REQUEST);
        expect(response.lastResponse).to.deep.equal({ error: testErrorMessage });
    });

    it('Should take correct name from params', async () => {
        const fileName = 'testFileName';
        const response = createResponse();

        uploadImage = async (imageData, imageName) => {
            expect(imageName).to.equal(fileName);
        };

        await SUT({
            files: {
                image: 'test',
                mimetype: 'image/jpeg'
            },
            params: {
                id: fileName
            }
        }, response);
    });

    it('Should respond with error 500 when something happens during upload', async () => {
        const response = createResponse();

        uploadImage = async () => {
            const error = new Error();
            throw error;
        };

        await SUT({
            files: {
                image: 'test'
            }
        }, response);

        expect(response.lastStatus).to.equal(INTERNAL_SERVER_ERROR);
        expect(response.lastResponse).to.deep.equal({ error: 'There was an error during uploading. Please try again.' });
    });

    it('Should respond with image id when upload succeeds', async () => {
        const response = createResponse();

        const testId = 'test_id';
        uploadImage = async () => {
            return {
                id: testId
            };
        };

        await SUT({
            files: {
                image: 'test'
            }
        }, response);

        expect(response.lastResponse).to.deep.equal({ imageId: testId });
    });

});