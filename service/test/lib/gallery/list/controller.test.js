const proxyquire = require('proxyquire');
const { expect } = require('chai');
const { NOT_FOUND } = require('http-status-codes');
const { createResponse } = require('../../../helpers/express-response');

describe('lib.gallery.list.controller', () => {

    let testImages;

    //mock service response
    const SUT = proxyquire('../../../../lib/gallery/list/controller', {
        './service' : {
            getGallery: async () => {
                return testImages;
            }
        }
    });

    it('Should send gallery when gallery exists', async () => {
        testImages = ['1', '2', '3'];

        const req = {};
        const res = createResponse();

        await SUT(req, res);
        expect(res.lastResponse).to.deep.equal(testImages);
    });

    it('Should send 404 error when gallery does not exist', async () => {
        testImages = null;

        const req = {};
        const res = createResponse();

        await SUT(req, res);
        expect(res.lastResponse).to.deep.equal({
            error: 'No gallery found with id 0'
        });
        expect(res.lastStatus).to.equal(NOT_FOUND);
    });
});