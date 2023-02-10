const { model, Schema, Types } = require('mongoose');
const moment = require('moment');

// Creating reaction sub document for thought schema
const reactionsSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: String,
            default: moment().format('MMMM Do YYYY, h:mm:ss a')
        }
    },
    {
        _id: false
    }
)

// Creating Thought model's schema
const thoughtsSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: String,
            default: moment().format('MMMM Do YYYY, h:mm:ss a')
        },
        username: {
            type: String,
            required: true
        },
        reactions:[
            reactionsSchema
        ]
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

// Setting Thought model's schema's virtual
thoughtsSchema.virtual('reactionCount').get(function() {
    return this.reactions.length
});

// Creating Thought model
const Thought = model('Thought', thoughtsSchema);

module.exports = Thought;