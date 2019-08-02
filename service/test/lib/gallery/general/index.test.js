const { expect } = require('chai');
const proxyquire = require('proxyquire');

//mock storage method that checks for existance of images so that it will return true for specific names
const SUT = proxyquire('../../../../lib/gallery/general', {
    '../../storage' : {
        existsInStorage: (name) => {
            return name === 'exists';
        }
    }
});
const { initMongo } = require('../../../../lib/mongo-connector');
const { getImages, addImage } = SUT;
const { MongoConfig, MongoClient } = require('../../../helpers/mock-mongo-client');

describe('lib.gallery.general', () => {

    describe('getImages', () => {

        //mock Mongo query result
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

    describe('addImage', () => {

        //mock Mongo store - if we have something in storage already, return it as result of query,
        //if not - return null,
        //likewise imitate replacement of object in Mongo
        const initMongoWithGalleryMockStorage = async (storage) => {
            await initMongo(MongoClient({
                findOne: () => {
                    if (storage.length > 0) {
                        return Promise.resolve(storage[0])
                    } else {
                        return Promise.resolve(null)
                    }
                },
                replaceOne: (query, document) => {
                    if (storage.length > 0) {
                        storage.length = 0;
                    }

                    storage.push(document);
                }
            }), MongoConfig);
        };

        it('Should fail when trying to add non-existent image', async () => {
            try {
                await addImage(0, 'nonexistent');
                throw new Error('Exception was expected');
            } catch(err) {
                expect(err.message).to.equal('Trying to add non-existent image nonexistent to gallery 0');
            }
        });

        it('Should create gallery document from scratch if it\'s missing', async () => {
            const storage = [];
            await initMongoWithGalleryMockStorage(storage);
            await addImage(0, 'exists');

            expect(storage).to.have.lengthOf(1);

            const gallery = storage[0];
            expect(gallery.galleryId).to.equal(0);
            expect(gallery.images).to.deep.equal(['exists']);
        });

        it('Should successfully add image to gallery document', async () => {
            const storage = [{
                galleryId: 0,
                images: ['test']
            }];

            await initMongoWithGalleryMockStorage(storage);
            await addImage(0, 'exists');

            expect(storage).to.have.lengthOf(1);

            const gallery = storage[0];
            expect(gallery.galleryId).to.equal(0);
            expect(gallery.images).to.deep.equal(['test', 'exists']);
        });
    });

});