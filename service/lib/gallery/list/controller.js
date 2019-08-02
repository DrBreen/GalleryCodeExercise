const { getGallery } = require('./service');
const { NOT_FOUND } = require('http-status-codes');

//hardcoded for now, as there may be more galleries with permissions required to access them
const galleryId = 0;

const listGalleryController = async (req, res) => {
    const gallery = await getGallery(galleryId);

    if (!gallery) {
        return res.status(NOT_FOUND).send({
            error: `No gallery found with id ${galleryId}`
        });
    }

    return res.send(gallery.images);
};

module.exports = listGalleryController;