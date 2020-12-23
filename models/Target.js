const mongoose = require('mongoose');

const TargetSchema = mongoose.Schema( 
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false,
            default: "no description"
        },
        count: {
            type: Number,
            required: true,
            default: 0
        },
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        due: {
            type: Date,
            required: true,
            default: new Date(new Date().setHours(24, 0, 0, 0))
        },
        email: {
            type: String,
            required: true
        }
    }
); 

module.exports = mongoose.model('Target', TargetSchema);
