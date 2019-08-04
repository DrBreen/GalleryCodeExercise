const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');

const imageController = require('../gallery/image/controller');
const uploadController = require('../gallery/upload/controller');
const listController = require('../gallery/list/controller');

const notFoundHandler = require('../error/notFoundHandler');
const errorHandler = require('../error/errorHandler');

router.use(fileUpload());

router.get('/gallery/:id', (req, res, next) => {
    imageController(req, res).catch(next);
});

router.get('/gallery', (req, res, next) => {
    listController(req, res).catch(next);
});

router.post('/gallery', (req, res, next) => {
    uploadController(req, res).catch(next);
});

router.post('/gallery/:id', (req, res, next) => {
    uploadController(req, res).catch(next);
});

router.use(errorHandler);
router.use(notFoundHandler);

module.exports = router;
