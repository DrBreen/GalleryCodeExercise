const express = require('express');
const router = express.Router();

const uploadController = require('../gallery/upload/controller');

const notFoundHandler = require('../error/notFoundHandler');
const errorHandler = require('../error/errorHandler');

const fileUpload = require('express-fileupload');

router.use(fileUpload());

//TODO: add image route
//TODO: add gallery route

router.post('/upload', (req, res, next) => {
    uploadController(req, res).catch(next);
});

router.use(errorHandler);
router.use(notFoundHandler);

module.exports = router;
