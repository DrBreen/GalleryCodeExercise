const proxyquire = require('proxyquire');
const { expect } = require('chai');
const uuid = require('uuid');
const path = require('path');
const { OVERWRITING_NONEXISTENT_FILE_ERROR } = require('../../../../lib/storage');

let saveShouldThrow = false;
let saveErrorCode;
let mongoSaveShouldThrow = false;

//virtual filesystem: path is mapped to contents of file
let virtualFs = {};

//virtual Mongo: galleryId is mapped to a saved image id
let virtualMongo = {};

const rootLocation = '/root';
const SUT = proxyquire('../../../../lib/gallery/upload/service', {
    '../../storage' : {
        saveToStorage: async (data, providedName) => {
            if (saveShouldThrow) {
                const error = new Error('Test saveToStorage error');
                error.errorCode = saveErrorCode;
                throw error;
            }

            let name;
            if (providedName) {
                name = providedName;
            } else {
                name = uuid();
            }

            virtualFs[path.join(rootLocation, name)] = data;

            return {
                name
            };
        },

        deleteFromStorage: async (name) => {
            delete virtualFs[path.join(rootLocation, name)];
        }
    },
    '../general' : {
        addImage: async (galleryId, name) => {
            if (mongoSaveShouldThrow) {
                throw new Error('Test addImage error');
            }

            virtualMongo[galleryId] = name;
        }
    }
});

const storage = require('../../../../lib/storage');
storage.initStorage(rootLocation);

const {
    uploadImage,
    NOT_AN_IMAGE_FAILURE,
    OVERWRITING_NONEXISTENT_FILE_FAILURE
} = SUT;

describe('lib.gallery.upload.service', () => {

    beforeEach(() => {
        virtualFs = {};
        virtualMongo = {};
        mongoSaveShouldThrow = false;
        saveShouldThrow = false;
        saveErrorCode = null;
    });

    describe('uploadImage', () => {

        it('Should throw an error if supplied data is not an image', async () => {
            try {
                await uploadImage({
                    mimetype: 'text/plain'
                });

                throw new Error('No exception was thrown even though it was excepted');
            } catch(err) {
                expect(err.errorCode).to.be.equal(NOT_AN_IMAGE_FAILURE);
            }
        });

        it('Should throw if there was an error during saving the file', async () => {
            saveShouldThrow = true;

            try {
                await uploadImage({
                    mimetype: 'image/png',
                    data: []
                });
            } catch(err) {
                expect(err.message).to.equal('Test saveToStorage error');
            }

        });

        it('Should delete image from disk and throw in case there was problem with Mongo', async () => {
            mongoSaveShouldThrow = true;

            try {
                await uploadImage({
                    mimetype: 'image/png',
                    data: []
                });
            } catch(err) {
                expect(virtualFs[path.join(rootLocation, err.failedImageName)]).to.be.undefined;
                expect(err.message).to.equal('Test addImage error');
            }
        });

        it('Should successfully save image to disk and to Mongo', async () => {
            const testData = 'Test data';

            const { id } = await uploadImage({
                mimetype: 'image/png',
                data: testData
            });

            expect(virtualFs[path.join(rootLocation, id)]).to.equal(testData);
            expect(virtualMongo[0]).to.equal(id);
        });

        it('Should not try to save data to Mongo if file is being replaced', async () => {
            mongoSaveShouldThrow = true;
            const testData = 'Test data';

            const existingId = 'existingTestId';
            virtualFs[path.join(rootLocation, existingId)] = 'Old test data';

            const { id } = await uploadImage({
                mimetype: 'image/png',
                data: testData
            }, existingId);

            expect(id).to.equal(existingId);
            expect(virtualFs[path.join(rootLocation, id)]).to.equal(testData);
        });

        it('Should throw error with correct code if overwriting failed due to nonexistent file', async () => {
            saveShouldThrow = true;
            saveErrorCode = OVERWRITING_NONEXISTENT_FILE_ERROR;

            try {
                await uploadImage({
                    mimetype: 'image/png',
                    data: 'someData'
                }, 'someId');

                throw new Error('uploadImage should have thrown!');
            } catch (err) {
                expect(err.errorCode).to.equal(OVERWRITING_NONEXISTENT_FILE_FAILURE);
            }
        });

    });

});