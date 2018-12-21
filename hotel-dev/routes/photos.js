const express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router(),
    { amazonUploadHotel, deletePhotos } = require('../config/amazon'),
    { checkIfOwner, checkIfHotelExists } = require('../helpers/auth');


// Load Hotel Model
require('../models/Hotel')
const Hotel = mongoose.model('hotels')


// UPLOAD PHOTO
router.post('/:id/photos/upload', checkIfHotelExists, checkIfOwner, amazonUploadHotel.array('images', 4), (req, res) => {
    Hotel.updateOne({ _id: req.params.id }, {
        "$push": { "images": req.files }
    },
        { safe: true, multi: true }, (err, obj) => {
            req.flash('success_msg', 'Image Uploaded!')
            res.redirect('back')
        }
    )
})

// DELETE PHOTO
router.delete('/photos/:id/:name', checkIfHotelExists, checkIfOwner, (req, res) => {
    Hotel.find({ _id: req.params.id }).then(hotel => {
            deletePhotos(hotel[0].images, req.params.name)
        }).then(() => {
        Hotel.updateOne({ _id: req.params.id }, {
            "$pull": { "images": { "key": req.params.name } }
        },
            { safe: true, multi: true }, function (err, obj) {
                req.flash('success_msg', 'Image Deleted!')
                res.redirect('back')
            })
    })
})

module.exports = router