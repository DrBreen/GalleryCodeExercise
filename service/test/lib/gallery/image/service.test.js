const proxyquire = require('proxyquire');
const { expect } = require('chai');

const correctPath = '/path/to/exists';
const SUT = proxyquire('../../../../lib/gallery/image/service', {
    '../../storage' : {
        pathForName: () => correctPath,
        existsInStorage: (name) => name === 'exists'
    }
});
const { getPathToImageWithId } = SUT;

describe('lib.gallery.image.service', () => {

    describe('getPathToImageWithId', () => {

        it('Should return nothing if image with given name does not exists', async () => {
            expect(await getPathToImageWithId('does_not_exists')).to.be.undefined;
        });

        it('Should return correct path if image with given name exists', async () => {
            expect(await getPathToImageWithId('exists')).to.equal(correctPath);
        });

    });

});