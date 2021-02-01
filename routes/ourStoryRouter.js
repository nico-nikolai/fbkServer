const express = require('express');
const authenticate = require('../authenticate');

const ourStoryRouter = express.Router();

ourStoryRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send the our-story item to you');
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /our-story`);
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /our-story');
})
.delete(authenticate.verifyUser, (req, res) => {
    res.end('Deleting our-story item')
});

module.exports = ourStoryRouter;