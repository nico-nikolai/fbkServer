const express = require('express');
const homeRouter = express.Router();

homeRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send promotional home items to you`)
})
.post((req, res) => {
    res.end(`Will add the promotional home item: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /home');
})
.delete((req, res) => {
    res.end('Deleting all promotional home content');
});

module.exports = homeRouter