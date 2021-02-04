const express = require('express');
const Home = require('../models/home');
const authenticate = require('../authenticate');
const cors = require('./cors');

const homeRouter = express.Router();

homeRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Home.find()
    .then(homeItems => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(homeItems)
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Home.create(req.body)
    .then(homeItem => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(homeItem);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /home');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Home.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = homeRouter