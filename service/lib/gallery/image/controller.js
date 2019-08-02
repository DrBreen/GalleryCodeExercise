const { getPathToImageWithId } = require('./service');
const { NOT_FOUND, BAD_REQUEST } = require('http-status-codes');
const validFilename = require('valid-filename');

const imageController = async (req, res) => {
    const id = req.params.id;

    //protect against path injections where %2F can be used to inspect internal directories
    if (!validFilename(id)) {
        return res.status(BAD_REQUEST).send({
            error: `${id} is not a valid id`
        });
    }

    const path = await getPathToImageWithId(id);

    if (!path) {
        return res.status(NOT_FOUND).send({
            error: `Image with id ${id} does not exists`
        });
    }

    return res.sendFile(path);
};

module.exports = imageController;