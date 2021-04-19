const { Schema, model } = require('mongoose');

let booksSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    userId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, { collection: 'books' });

booksSchema.methods.toJSON = function() {
    let { __v, ...booksObject } = this.toObject();
    return booksObject;
}

module.exports = model('Books', booksSchema);