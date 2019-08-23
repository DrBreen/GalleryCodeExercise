const { expect } = require('chai');
const proxyquire = require('proxyquire');
const { BAD_REQUEST } = require('http-status-codes');
const { createResponse } = require('../../../helpers/express-response');

let setCommentImplementation;
const SUT = proxyquire('../../../../lib/gallery/comment/controller', {
    './service' : {
        setComment: (id, comment) => setCommentImplementation(id, comment)
    }
});

describe('lib.gallery.comment.controller', () => {

    it('should return error if comment is missing from the body', async () => {
        const req = {};
        const res = createResponse();

        await SUT(req, res);

        expect(res.lastStatus).to.equal(BAD_REQUEST);
    });

    it('should get correct image id and comment from request', async () => {
        const req = {
            body: {
                comment: 'Test comment',
            },
            params: {
                id: 'Test id'
            }
        };
        const res = createResponse();

        let called = false;
        setCommentImplementation = (id, comment) => {
            called = true;
            expect(id).to.equal('Test id');
            expect(comment).to.equal('Test comment');
        };

        await SUT(req, res);
        expect(res.lastResponse).to.equal(undefined);
        expect(called).to.equal(true);
    });

});