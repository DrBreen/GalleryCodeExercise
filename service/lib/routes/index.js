const express = require('express');
const router = express.Router();

const uploadController = require('../gallery/upload/controller');
const listController = require('../gallery/list/controller');

const notFoundHandler = require('../error/notFoundHandler');
const errorHandler = require('../error/errorHandler');

const fileUpload = require('express-fileupload');

router.use(fileUpload());

//TODO: add image route

router.get('/gallery', (req, res, next) => {
    listController(req, res).catch(next);
});

router.post('/gallery', (req, res, next) => {
    uploadController(req, res).catch(next);
});

router.use(errorHandler);
router.use(notFoundHandler);

module.exports = router;
