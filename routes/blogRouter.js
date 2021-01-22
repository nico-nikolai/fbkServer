const express = require('express');
const blogRouter = express.Router();

blogRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send blogs to you`)
})
.post((req, res) => {
    res.end(`Will add the blog: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /blogs');
})
.delete((req, res) => {
    res.end('Deleting all blogs');
});

blogRouter.route('/:blogId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the blog: ${req.params.blogId} to you.`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /blogs/${req.params.blogId}`);
})
.put((req, res) => {
    res.write(`Updating the blog: ${req.params.blogId}\n`);
    res.end(`Will update the blog ${req.body.name} with description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting blog: ${req.params.blogId}`);
});
module.exports = blogRouter