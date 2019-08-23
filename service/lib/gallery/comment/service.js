const { saveComment } = require('../general');

const galleryId = 0;

const setComment = async (name, comment) => {
    await saveComment(galleryId, name, comment);
};

Object.assign(module.exports, {
    setComment
});