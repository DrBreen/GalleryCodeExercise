const { setComment } = require('./service');
const { BAD_REQUEST } = require('http-status-codes');
const _ = require('lodash');

const commentController = async (req, res) => {

    if (!_.has(req, 'body.comment')) {
        return res.status(BAD_REQUEST).send({
            error: `Comment is missing from request body`
        });
    }

    const comment = req.body.comment;
    const id = req.params.id;
    await setComment(id, comment);

    return res.send();
};

module.exports = commentController;