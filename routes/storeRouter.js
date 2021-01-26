const express = require('express');
const Store = require('../models/store');

const storeRouter = express.Router();

storeRouter.route('/')
.get((req, res, next) => {
    Store.find()
    .then(storeItems => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(storeItems);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Store.create(req.body)
    .then(storeItem => {
        console.log('Store Item Created', storeItem);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(storeItem);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /store');
})
.delete((req, res, next) => {
    Store.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

storeRouter.route('/:itemId')
.get((req, res, next) => {
    Store.findById(req.params.itemId)
    .then(item => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /store/${req.params.itemId}`)
})
.put((req, res, next) => {
    Store.findByIdAndUpdate(req.params.itemId, {
        $set: req.body
    }, { new: true })
    .then(item => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Store.findByIdAndDelete(req.params.itemId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err))
});

module.exports = storeRouter;