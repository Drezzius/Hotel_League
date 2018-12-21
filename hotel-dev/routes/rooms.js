const express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router(),
    { amazonUploadHotel, deleteImages } = require('../config/amazon'),
    { checkIfOwner, checkIfHotelExists } = require('../helpers/auth');

// Load Hotel Model
require('../models/Hotel')
const Hotel = mongoose.model('hotels')

router.get('/:id/room/add', checkIfHotelExists, checkIfOwner, (req, res) => {
    Hotel.findOne({ _id: req.params.id}).then(hotel => {
        res.render('hotels/rooms/add', { hotel })
    })
})
// Create Room Route
router.post('/:id/room', checkIfHotelExists, checkIfOwner, amazonUploadHotel.array('images', 4), (req, res) => {
    Hotel.updateMany({ _id: req.params.id }, {
        "$push": { "rooms": [
            { "roomName": req.body.roomName,
              "roomDescription": req.body.roomDescription,
              "roomPrice": req.body.roomPrice,
              "roomImages" : req.files
            },
        ]}
    },
        { safe: true, multi: true }, (err, obj) => {
            req.flash('success_msg', 'Room Added!')
            res.redirect('/hotels/show/' + req.params.id)
        }
    )
})

// Edit Room Route
router.get('/:id/rooms/:roomId/edit', checkIfHotelExists, checkIfOwner, (req, res) => {
    Hotel.findOne({ _id: req.params.id }).then(hotel => {
        hotel.rooms.forEach(room => {
            if (room.id === req.params.roomId) {
                res.render('hotels/rooms/edit', { room, hotel })
            }
        })
    })
})

router.put('/:id/rooms/:roomId', checkIfHotelExists, checkIfOwner, (req, res) => {
    Hotel.findOne( { _id: req.params.id }).then(hotel => {
        hotel.rooms.forEach(room => {
            if (room.id === req.params.roomId) {
                room.roomName = req.body.roomName,
                room.roomDescription = req.body.roomDescription,
                room.roomPrice = req.body.roomPrice
                hotel.save().then(() => {
                    req.flash('success_msg', 'Room successfully updated!')
                    res.redirect('/hotels/show/' + req.params.id)
                })
            }
        })
    })
})

router.delete('/:id/rooms/:roomId', checkIfHotelExists, checkIfOwner, (req, res) => {
    Hotel.findOne({ _id: req.params.id }).then(hotel => {
        hotel.rooms.forEach(room => {
            if(room.id === req.params.roomId) {
                room.roomImages.forEach(image => {
                    deleteImages(image.key)     
                })
            }
        })
    }).then(() => {
        Hotel.updateOne({ _id: req.params.id }, {
            "$pull": { "rooms": { "_id": req.params.roomId } }
        },
            { safe: true, multi: true }, function (err, obj) {
                req.flash('success_msg', 'Room Deleted!')
                res.redirect('back')
            })
        })
})

// Upload photos to room
router.post('/:id/rooms/:roomId/upload', checkIfHotelExists, checkIfOwner, amazonUploadHotel.array('images', 4), (req, res) => {
    console.log(req.files)
    Hotel.findOne({ _id: req.params.id}).then(hotel => {
        hotel.rooms.forEach(room => {
            if(room.id === req.params.roomId) {
                room.roomImages.push(...req.files)
                hotel.save()
                req.flash('success_msg', 'Image Uploaded!')
                res.redirect('back')
            }
        })
    })
})

// Delete Room Photo
router.delete('/:id/photos/rooms/:roomId/:key', checkIfHotelExists, checkIfOwner, (req, res) => {
    Hotel.findOne({ _id: req.params.id }).then(hotel => {
        hotel.rooms.forEach(room => {
            if(room.id === req.params.roomId) {
                deleteImages(req.params.key)
                room.roomImages = room.roomImages.filter(image => {
                    return image.key !== req.params.key                     
                })
                hotel.save()
                req.flash('success_msg', 'Image Deleted!')
                res.redirect('back')
            }
        })
    })
})

module.exports = router