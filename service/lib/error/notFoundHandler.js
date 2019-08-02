const { NOT_FOUND } = require('http-status-codes');
const logger = require('../logger');

module.exports = (req, res, next) => {
    logger.debug('Request reached 404 handler');
    res.status(NOT_FOUND);
    res.send('');
};