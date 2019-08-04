const proxyquire = require('proxyquire');
const { expect } = require('chai');

const testImages = ['1', '2', '3', '4', '5', '6'];
const SUT = proxyquire('../../../../lib/gallery/list/service', {
    '../general' : {
        getImages: async (imageId) => {
            if (imageId === -1) {
                return;
            }

            return testImages;
        }
    }
});

const { getGallery } = SUT;

describe('lib.gallery.list.service', () => {
    describe('getGallery', () => {

        it('should pass result of call from getImages to the caller when no offset is provided', async () => {
            const actual = await getGallery(0);
            const expected = {
                count: testImages.length,
                imageIds: testImages
            };

            expect(actual).to.deep.equal(expected);
        });

        it('should return correct array when offset and count are provided and are within bounds', async () => {
            const actual = await getGallery(0, 1, 3);
            const expected = {
                count: testImages.length,
                imageIds: ['2', '3', '4']
            };

            expect(actual).to.deep.equal(expected);
        });

        it('should return correct array when offset and count are provided and offset is out of bounds', async () => {
            const actual = await getGallery(0, 6, 3);
            const expected = {
                count: testImages.length,
                imageIds: []
            };

            expect(actual).to.deep.equal(expected);
        });

        it('should return correct array when offset and count are provided and count is larger than an array', async () => {
            const actual = await getGallery(0, 2, 100);
            const expected = {
                count: testImages.length,
                imageIds: ['3', '4', '5', '6']
            };

            expect(actual).to.deep.equal(expected);
        });

        it('should return nothing when non-existing galleryId is provided', async () => {
            const actual = await getGallery(-1);
            const expected = undefined;

            expect(actual).to.equal(expected);
        });
    });
});