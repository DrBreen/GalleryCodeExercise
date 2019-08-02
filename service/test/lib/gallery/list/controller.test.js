const proxyquire = require('proxyquire');
const { expect } = require('chai');
const { NOT_FOUND } = require('http-status-codes');

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

    //mock express response object
    const createResponse = () => {
        const response = {
            lastStatus: 0,
            lastResponse: null,
        };

        response.status = (status) => {
            response.lastStatus = status;
            return response;
        };

        response.send = (body) => {
            response.lastResponse = body;
        };

        return response;
    };

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