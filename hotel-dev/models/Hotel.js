const   mongoose = require('mongoose'),
        Schema = mongoose.Schema;

// Create Schema
const HotelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rooms: [{
        roomName: {
            type: String,
            required: true
        },
        roomDescription: {
            type: String,
        },
        roomPrice: {
            type: Number
        },
        roomImages: {
            type: Array,
            default: undefined
        }
    }],
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    webpage: {
        type: String,
        required: true
    },
    price: { 
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: undefined
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('hotels', HotelSchema)