const { NOT_FOUND } = require('http-status-codes');
const { expect } = require('chai');
const { createResponse } = require('../../helpers/express-response');

const SUT = require('../../../lib/error/notFoundHandler');

describe('lib.error.notFoundHandler', () => {
    it('Should send empty body with 404 code', () => {
        const req = {};
        const res = createResponse();

        SUT(req, res);

        expect(res.lastStatus).to.equal(NOT_FOUND);
        expect(res.lastResponse).to.equal('');
    });
});