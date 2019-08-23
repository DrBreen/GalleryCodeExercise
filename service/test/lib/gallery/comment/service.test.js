const proxyquire = require('proxyquire');
const { expect } = require('chai');

let saveCommentImplementation;
const SUT = proxyquire('../../../../lib/gallery/comment/service', {
    '../general' : {
        saveComment: (galleryId, name, comment) => saveCommentImplementation(galleryId, name, comment)
    }
});

const { setComment } = SUT;

describe('lib.gallery.comment.service', () => {

    describe('setComment', () => {
        it('should save comment with correct name and comment in correct gallery', async () => {
            let called = false;

            const expectedName = "testId";
            const expectedComment = "comment";

            saveCommentImplementation = (galleryId, name, comment) => {
                called = true;

                expect(galleryId).to.equal(0);
                expect(name).to.equal(expectedName);
                expect(comment).to.equal(expectedComment);
            };

            setComment(expectedName, expectedComment);

            expect(called).to.equal(true);
        });
    });

});
