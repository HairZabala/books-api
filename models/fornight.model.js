const { Schema, model } = require('mongoose');

let fornightSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    from: {
        type: Date,
        required: true,
    },
    to: {
        type: Date,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    closed: {
        type: Boolean,
        default: false
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, { collection: 'fornights' });

fornightSchema.methods.toJSON = function() {
    let { __v, ...fornightObject } = this.toObject();
    return fornightObject;
}

module.exports = model('Fornight', fornightSchema);