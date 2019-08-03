const proxyquire = require('proxyquire');
const { expect } = require('chai');
const { NOT_FOUND } = require('http-status-codes');
const { createResponse } = require('../../../helpers/express-response');

describe('lib.gallery.list.controller', () => {

    let testImages;

    //mock service response
    const SUT = proxyquire('../../../../lib/gallery/list/controller', {
        './service' : {
            getGallery: async (galleryId, offset, count) => {
                if (offset !== undefined && count !== undefined) {
                    return testImages.slice(Math.max(0, offset), Math.min(offset + count, testImages.length));
                } else {
                    return testImages;
                }
            }
        }
    });

    it('Should send whole gallery when gallery exists and no offset and count were provided', async () => {
        testImages = ['1', '2', '3'];

        const req = { query: {} };
        const res = createResponse();

        await SUT(req, res);
        expect(res.lastResponse).to.deep.equal(testImages);
    });

    it('Should send whole gallery when gallery exists when only offset was provided', async () => {
        testImages = ['1', '2', '3', '4', '5', '6', '7'];

        const req = {
            query: {
                offset: 1
            }
        };
        const res = createResponse();

        await SUT(req, res);
        expect(res.lastResponse).to.deep.equal(testImages);
    });

    it('Should send whole gallery when gallery exists when only count was provided', async () => {
        testImages = ['1', '2', '3', '4', '5', '6', '7'];

        const req = {
            query: {
                count: 1
            }
        };
        const res = createResponse();

        await SUT(req, res);
        expect(res.lastResponse).to.deep.equal(testImages);
    });

    it('Should send gallery with offset and count when gallery exists', async () => {
        testImages = ['1', '2', '3', '4', '5', '6', '7'];

        const req = {
            query: {
                offset: 1,
                count: 2
            }
        };
        const res = createResponse();

        await SUT(req, res);
        expect(res.lastResponse).to.deep.equal(['2', '3']);
    });

    it('Should send 404 error when gallery does not exist', async () => {
        testImages = null;

        const req = { query: {} };
        const res = createResponse();

        await SUT(req, res);
        expect(res.lastResponse).to.deep.equal({
            error: 'No gallery found with id 0'
        });
        expect(res.lastStatus).to.equal(NOT_FOUND);
    });
});