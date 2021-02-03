const express = require('express');
const Blog = require('../models/blogs');
const authenticate = require('../authenticate');

const blogRouter = express.Router();

blogRouter.route('/')
.get((req, res, next) => {
    Blog.find()
    .then(blogs => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blogs);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Blog.create(req.body)
    .then(blog => {
        console.log('Blog Item Created', blog);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog)
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /blogs');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Blog.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

blogRouter.route('/:blogId')
.get((req, res, next) => {
    Blog.findById(req.params.blogId)
    .then(blog => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /blogs/${req.params.blogId}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Blog.findByIdAndUpdate(req.params.blogId, {
        $set: req.body
    }, { new: true })
    .then(blog => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Blog.findByIdAndDelete(req.params.blogId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = blogRouter