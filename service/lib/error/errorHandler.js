const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const logger = require('../logger');

module.exports = (err, req, res, next) => {
    if (err) {
        logger.error(err);

        res.status(INTERNAL_SERVER_ERROR);
        res.send('');
    } else {
        next(err, req, res);
    }
};