const { expect } = require('chai');
const express = require('express');
const proxyquire = require('proxyquire');
const request = require('supertest');
const { NOT_FOUND, INTERNAL_SERVER_ERROR, OK } = require('http-status-codes');

let imageController;
let uploadController;
let listController;
let commentController;

const SUT = proxyquire('../../../lib/routes', {
    '../gallery/image/controller' : (req, res) => imageController(req, res),
    '../gallery/upload/controller' : (req, res) => uploadController(req, res),
    '../gallery/list/controller' : (req, res) => listController(req, res),
    '../gallery/comment/controller' : (req, res) => commentController(req, res),
    'express-fileupload' : () => (req, res, next) => next()
});

describe('lib.routes', () => {

    let app;
    let server;

    beforeEach(() => {
        imageController = null;
        uploadController = null;
        listController = null;

        app = express();
        app.use('/', SUT);
        server = app.listen(9999);
    });

    afterEach(() => {
        server.close();
        server = null;
        app = null;
    });

    it('Should reach 404 handler if requesting unknown address', async () => {
        request(server).get('/unknown_route').end((err, res) => {
            expect(res.status).to.equal(NOT_FOUND);
        });
    });

    it('Should catch exception in any controller and send error 500', () => {
        imageController = async (req, res) => {
            throw new Error('Test exception');
        };
        uploadController = imageController;
        listController = imageController;

        request(server).get('/gallery').end((err, res) => {
            expect(res.status).to.equal(INTERNAL_SERVER_ERROR);
        });

        request(server).get('/gallery/test_id').end((err, res) => {
            expect(res.status).to.equal(INTERNAL_SERVER_ERROR);
        });

        request(server).post('/gallery').end((err, res) => {
            expect(res.status).to.equal(INTERNAL_SERVER_ERROR);
        });
    });

    it('GET /gallery should proceed to call list controller', () => {
        let called = false;
        listController = async (req, res) => {
            called = true;
            res.send('');
        };

        request(app).get('/gallery').end((err, res) => {
            expect(res.statusCode).to.equal(OK);
            expect(called).to.equal(true);
        });
    });

    it('GET /gallery/:id should proceed to call image controller', () => {
        let called = false;
        imageController = async (req, res) => {
            called = true;
            res.send('');
        };

        request(app).get('/gallery/test_id').end((err, res) => {
            expect(res.statusCode).to.equal(OK);
            expect(called).to.equal(true);
        });
    });

    it('POST /gallery should proceed to call upload controller', () => {
        let called = false;
        uploadController = async (req, res) => {
            called = true;
            res.send('');
        };

        request(app).post('/gallery').end((err, res) => {
            expect(res.statusCode).to.equal(OK);
            expect(called).to.equal(true);
        });
    });

    it('POST /gallery/:id should proceed to call upload controller', () => {
        let called = false;
        uploadController = async (req, res) => {
            called = true;
            res.send('');
        };

        request(app).post('/gallery/testId').end((err, res) => {
            expect(res.statusCode).to.equal(OK);
            expect(called).to.equal(true);
        });
    });

    it('PUT /comments/:id should proceed to call comments controller', () => {
        let called = false;
        commentController = async (req, res) => {
            called = true;
            res.send('');
        };

        request(app).put('/comments/testId').end((err, res) => {
            expect(res.statusCode).to.equal(OK);
            expect(called).to.equal(true);
        });
    });


});

