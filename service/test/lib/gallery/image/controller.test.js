const proxyquire = require('proxyquire');
const { expect } = require('chai');
const { NOT_FOUND, BAD_REQUEST } = require('http-status-codes');

const existingPath = '/path/to/exists';
const SUT = proxyquire('../../../../lib/gallery/image/controller', {
    './service' : {
        getPathToImageWithId: (name) => {
            return name === 'exists' ? existingPath : undefined;
        }
    }
});

const { createResponse } = require('../../../helpers/express-response');

describe('lib.gallery.image.controller', () => {

    const createRequestWithId = (id) => ({
        params: {
            id
        }
    });

    it('Should return 400 error when filename is invalid', async () => {
        const id = 'internal_folder/internal_file';
        const req = createRequestWithId(id);
        const res = createResponse();

        await SUT(req, res);

        expect(res.lastStatus).to.equal(BAD_REQUEST);
        expect(res.lastResponse).to.deep.equal({
            error: `${id} is not a valid id`
        });
    });

    it('Should return 404 error when requested image does not exists', async () => {
        const id = 'does_not_exist';
        const req = createRequestWithId(id);
        const res = createResponse();

        await SUT(req, res);

        expect(res.lastStatus).to.equal(NOT_FOUND);
        expect(res.lastResponse).to.deep.equal({
            error: `Image with id ${id} does not exists`
        });
    });

    it('Should send file when it exists', async () => {
        const id = 'exists';
        const req = createRequestWithId(id);
        const res = createResponse();

        await SUT(req, res);

        expect(res.lastSentFilePath).to.equal(existingPath);
    });

});