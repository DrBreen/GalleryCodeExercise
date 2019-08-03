const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { expect } = require('chai');
const proxyquire = require('proxyquire');
const { createResponse } = require('../../helpers/express-response');

const SUT = require('../../../lib/error/errorHandler');

describe('lib.error.errorHandler', () => {
    it('Should not interfere with non-error request', () => {
        const expectedReq = { req: true };
        const expectedRes = { res: true };
        SUT(null, expectedReq, expectedRes, (err, req, res) => {
            expect(err).to.be.null;
            expect(req).to.deep.equal(expectedReq);
            expect(res).to.deep.equal(expectedRes);
        });
    });

    it('Should return "Something went wrong" error with 500 status code and should not pass it further', () => {
        const expectedReq = { req: true };
        const expectedRes = createResponse();

        SUT(new Error('Test error'), expectedReq, expectedRes, (err, req, res) => {
            throw new Error('Error 500 was passed further!');
        });

        expect(expectedRes.lastStatus).to.equal(INTERNAL_SERVER_ERROR);
        expect(expectedRes.lastResponse).to.deep.equal({
            error: 'Something went wrong'
        });
    });
});