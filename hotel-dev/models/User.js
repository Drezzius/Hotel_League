const   mongoose = require('mongoose'),
        Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    superadmin: {
        type: Boolean,
    },
    admin: {
        type: Boolean,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('users', UserSchema)