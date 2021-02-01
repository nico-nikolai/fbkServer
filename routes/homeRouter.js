const express = require('express');
const Home = require('../models/home');
const authenticate = require('../authenticate');

const homeRouter = express.Router();

homeRouter.route('/')
.get((req, res, next) => {
    Home.find()
    .then(homeItems => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(homeItems)
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Home.create(req.body)
    .then(homeItem => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(homeItem);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /home');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Home.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = homeRouter