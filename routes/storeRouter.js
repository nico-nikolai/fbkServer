const express = require('express');
const Store = require('../models/store');
const authenticate = require('../authenticate');

const storeRouter = express.Router();

storeRouter.route('/')
.get((req, res, next) => {
    Store.find()
    .populate('reviews.author')
    .then(storeItems => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(storeItems);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Store.create(req.body)
    .then(storeItem => {
        console.log('Store Item Created', storeItem);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(storeItem);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /store');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
    .populate('reviews.author')
    .then(item => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /store/${req.params.itemId}`)
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
    .populate('reviews.author')
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
.post(authenticate.verifyUser, (req, res, next) => {
    Store.findById(req.params.itemId)
    .then(storeItem => {
        if (storeItem) {
            req.body.author = req.user._id;
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
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /store/${req.params.itemId}/reviews`);
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
    .populate('reviews.author')
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
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /store/${req.params.itemId}/comments/${req.params.reviewId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Store.findById(req.params.itemId)
    .then(storeItem => {
        if (storeItem && storeItem.reviews.id(req.params.reviewId)) {
            if (storeItem.reviews.id(req.params.reviewId).author.toString() === req.user._id.toString()) {
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
            } else {
                const err = new Error('You are not authorized to update this comment!');
                err.status = 403;
                return next(err);
            }
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
.delete(authenticate.verifyUser, (req, res, next) => {
    Store.findById(req.params.itemId)
    .then(storeItem => {
        if (storeItem && storeItem.reviews.id(req.params.reviewId)) {
            if (storeItem.reviews.id(req.params.reviewId).author.toString() === req.user._id.toString()) {
                storeItem.reviews.id(req.params.reviewId).remove();
                storeItem.save()
                .then(item => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(item);
                })
                .catch(err => next(err));
            } else {
                const err = new Error('You are not authorized to delete this review!');
                err.status = 403;
                return next(err);
            }
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