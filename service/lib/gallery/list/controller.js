const { getGallery } = require('./service');
const { NOT_FOUND } = require('http-status-codes');

//hardcoded for now, as there may be more galleries with permissions required to access them
const galleryId = 0;

const listGalleryController = async (req, res) => {

    let offset = parseInt(req.query.offset);
    let count = parseInt(req.query.count);

    if (isNaN(offset)) {
        offset = undefined;
    }

    if (isNaN(count)) {
        count = undefined;
    }

    const gallery = await getGallery(galleryId, offset, count);

    if (!gallery) {
        return res.status(NOT_FOUND).send({
            error: `No gallery found with id ${galleryId}`
        });
    }

    return res.send(gallery);
};

module.exports = listGalleryController;