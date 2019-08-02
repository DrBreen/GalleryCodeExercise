const { expect } = require('chai');

const { getImages, addImage } = require('../../../../lib/gallery/general');
const { initMongo } = require('../../../../lib/mongo-connector');

const { MongoConfig, MongoClient } = require('../../../helpers/mock-mongo-client');

describe('lib.gallery.general', () => {


    describe('getImages', () => {

        const initMongoWithGalleryMockData = async (gallery) => {
            await initMongo(MongoClient({
                findOne: () => Promise.resolve(gallery)
            }), MongoConfig);
        };

        it('Should return nothing if galleryId does not exist', async () => {

            await initMongoWithGalleryMockData(null);

            const images = await getImages(0);
            expect(images).to.be.undefined;
        });

        it('Should return empty array if galleryId exists without images', async () => {

            await initMongoWithGalleryMockData({ galleryId: 0, images: [] });

            const images = await getImages(0);
            expect(images).to.be.a('array');
            expect(images).to.have.lengthOf(0);
        });

        it('Should return array if galleryId exists with images', async () => {

            const expectedImages = ['1', '2', '3'];
            await initMongoWithGalleryMockData({ galleryId: 0, images: expectedImages });

            const images = await getImages(0);
            expect(images).to.equal(expectedImages);
        });

    });

});