const proxyquire = require('proxyquire');
const { expect } = require('chai');
const path = require('path');
const _ = require('lodash');

let virtualFs;
let generatedUuid;
const SUT = proxyquire('../../../lib/storage', {
    'fs' : {
        writeFile: (path, data, callback) => {
            virtualFs[path] = data;

            callback(null, null);
        },
        exists: (path, callback) => {
            callback(null, _.has(virtualFs, path))
        },
        unlink: (path, callback) => {
            delete virtualFs[path];

            callback(null, null);
        }
    },

    'uuid' : () => generatedUuid()
});

const {
    initStorage,
    saveToStorage,
    deleteFromStorage,
    existsInStorage,
    pathForName
} = SUT;


describe('lib.storage', () => {

    const rootLocation = '/root';

    beforeEach(() => {
        generatedUuid = null;
        initStorage(rootLocation);
        virtualFs = {};
    });

    describe('pathForName', () => {
        it('Should create correct path for given name', () => {
            const name = 'test';
            expect(pathForName('test')).to.equal(path.join(rootLocation, name));
        });
    });

    describe('existsInStorage', () => {
        it('Should return false when file does not exists', async () => {
            const existingName = 'exists';
            const notExistingName = 'notExists';
            const data = '123456';

            virtualFs[pathForName(existingName)] = data;

            expect(await existsInStorage(notExistingName)).to.equal(false);
        });

        it('Should return true when file exists', async () => {
            const existingName = 'exists';
            const data = '123456';

            virtualFs[pathForName(existingName)] = data;

            expect(await existsInStorage(existingName)).to.equal(true);
        });
    });

    describe('saveToStorage', () => {

        it('Should throw an error if attempting to overwrite non-existing file', async () => {
            const data = '123456';
            const fileName = 'doesNotExist';

            try {
                await saveToStorage(data, fileName);

                throw new Error('saveToStorage should have thrown!');
            } catch(err) {
                expect(err.message).to.equal(`Can only replace existing image - ${fileName} does not exist`);
            }
        });

        it('Should overwrite existing file with provided filename if it exists', async () => {
            const name = 'testFileName';
            virtualFs[pathForName(name)] = 'oldData';

            const newData = 'newData';
            await saveToStorage(newData, name);

            expect(virtualFs[pathForName(name)]).to.equal(newData);
        });

        it('Should not overwrite file in event of UUID collision', async () => {
            const data1 = '123456';
            const data2 = '789012';
            const uuid1 = '123456-1234-1234-123456';
            const uuid2 = '678901-6789-6789-678901';

            let shouldHaveCollision = true;
            generatedUuid = () => {
                if (shouldHaveCollision) {
                    shouldHaveCollision = false;
                    return uuid1;
                } else {
                    return uuid2;
                }
            };

            virtualFs[pathForName(uuid1)] = data1;

            await saveToStorage(data2);

            expect(Object.keys(virtualFs)).to.have.lengthOf(2);
            expect(virtualFs[pathForName(uuid1)]).to.equal(data1);
            expect(virtualFs[pathForName(uuid2)]).to.equal(data2);
        });

        it('Should save file correctly', async () => {
            const data = '123456';
            generatedUuid = () => '123456-1234-1234-123456';
            await saveToStorage(data);

            expect(Object.keys(virtualFs)).to.have.lengthOf(1);
            expect(virtualFs[pathForName(generatedUuid())]).to.equal(data);
        });
    });

    describe('deleteFromStorage', () => {
        it('Should delete file from correct path', async () => {
            const data1 = '123456';
            const data2 = '789012';
            const data3 = 'abcdef';
            const uuid1 = '123456-1234-1234-123456';
            const uuid2 = '678901-6789-6789-678901';
            const uuid3 = 'abcdef-abcd-abcd-abcdef';

            virtualFs[pathForName(uuid1)] = data1;
            virtualFs[pathForName(uuid2)] = data2;
            virtualFs[pathForName(uuid3)] = data3;

            await deleteFromStorage(uuid2);

            const expectedVirtualFs = {};
            expectedVirtualFs[pathForName(uuid1)] = data1;
            expectedVirtualFs[pathForName(uuid3)] = data3;

            expect(virtualFs).to.deep.equal(expectedVirtualFs);
        });
    });


});