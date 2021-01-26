const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;