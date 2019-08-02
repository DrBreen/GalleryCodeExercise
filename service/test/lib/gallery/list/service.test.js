const proxyquire = require('proxyquire');
const { expect } = require('chai');

const testImages = ['1', '2', '3'];
const SUT = proxyquire('../../../../lib/gallery/list/service', {
    '../general' : {
        getImages: async () => {
            return testImages;
        }
    }
});

const { getGallery } = SUT;

describe('lib.gallery.list.service', () => {
    describe('getGallery', () => {
        it('should pass result of call from getImages to the caller', async () => {
            const actual = await getGallery();
            const expected = testImages;

            expect(actual).to.deep.equal(expected);
        });
    });
});