const express = require('express');

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
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /our-story`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /our-story');
})
.delete((req, res) => {
    res.end('Deleting our-story item')
});

module.exports = ourStoryRouter;