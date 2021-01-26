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

storeRouter.route('/:itemId/reviews')
.get((req, res, next) => {
    Store.findById(req.params.itemId)
    .then(storeItem => {
        if (storeItem) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(storeItem.reviews);
        } else {
            err = new Error(`Store Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Store.findById(req.params.itemId)
    .then(storeItem => {
        if (storeItem) {
            storeItem.reviews.push(req.body);
            storeItem.save()
            .then(storeItem => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(storeItem.reviews);
            }) 
        } else {
            err = new Error(`Store Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /store/${req.params.itemId}/reviews`);
})
.delete((req, res, next) => {
    Store.findById(req.params.itemId)
    .then(storeItem => {
        if (storeItem) {
            for (let i = (storeItem.reviews.length-1); i >=0; i--) {
                storeItem.reviews.id(storeItem.reviews[i]._id).remove();
            }
            storeItem.save()
            .then(storeItem => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(storeItem.reviews);
            })
        } else {
            err = new Error(`Store Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

storeRouter.route('/:itemId/reviews/:reviewId')
.get((req, res, next) => {
    Store.findById(req.params.itemId)
    .then(storeItem => {
        if (storeItem && storeItem.reviews.id(req.params.reviewId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(storeItem.reviews.id(req.params.reviewId));
        } else if (!storeItem) {
            err = new Error(`Store Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Review ${req.params.reviewId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /store/${req.params.itemId}/comments/${req.params.reviewId}`);
})
.put((req, res, next) => {
    Store.findById(req.params.itemId)
    .then(storeItem => {
        if (storeItem && storeItem.reviews.id(req.params.reviewId)) {
            if (req.body.rating) {
                storeItem.reviews.id(req.params.reviewId).rating = req.body.rating;
            }
            if (req.body.text) {
                storeItem.reviews.id(req.params.reviewId).text = req.body.text;
            }
            storeItem.save()
            .then(item => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(item);
            })
            .catch(err => next(err));
        } else if (!storeItem) {
            err = new Error(`Store Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Review ${req.params.reviewId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Store.findById(req.params.itemId)
    .then(storeItem => {
        if (storeItem && storeItem.reviews.id(req.params.reviewId)) {
            storeItem.reviews.id(req.params.reviewId).remove();
            storeItem.save()
            .then(item => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(item);
            })
            .catch(err => next(err));
        } else if (!storeItem) {
            err = new Error(`Store Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Review ${req.params.reviewId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = storeRouter;