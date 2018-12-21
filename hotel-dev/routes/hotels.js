const express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router(),
    { amazonUploadHotel, deleteImages } = require('../config/amazon'),
    { ensureAuthenticated, checkIfAdmin, checkIfOwner, checkIfHotelExists } = require('../helpers/auth');

// Load Hotel Model
require('../models/Hotel')
const Hotel = mongoose.model('hotels')

router.get('/', ensureAuthenticated, checkIfAdmin, (req, res) => {
    Hotel.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(hotels => {
        res.render('hotels/index', {
            hotels
        })
    })
})

// Add Hotel
router.get('/add', checkIfAdmin, (req, res) => {
    res.render('hotels/add')
})

router.post('/', checkIfAdmin, amazonUploadHotel.array('images', 4), (req, res) => {
    let errors = []
    if (!req.body.name) {
        errors.push({ text: "Please add a title" })
    }
    if (!req.body.description) {
        errors.push({ text: "Please add some details" })
    }
    if (errors.length > 0) {
        res.render('hotels/add', {
            errors,
            name: req.body.name,
            description: req.body.description,
            phone: req.body.phone,
            email: req.body.email,
            webpage: req.body.webpage,
            images: req.files,
            price: req.body.price
        })
    } else {
        const newHotel = {
            name: req.body.name,
            description: req.body.description,
            phone: req.body.phone,
            email: req.body.email,
            webpage: req.body.webpage,
            price: req.body.price,
            images: req.files,
            user: req.user.id
        }
        new Hotel(newHotel)
            .save()
            .then(() => {
                req.flash('success_msg', 'Hotel added')
                res.redirect('/hotels')
            })
    }
        
})

// Edit Hotel from
router.get('/edit/:id', checkIfHotelExists, checkIfOwner, (req, res) => {
    Hotel.findOne({
        _id: req.params.id
    })
        .then(hotel => {
            if (hotel.user === req.user.id || res.locals.superadmin) {
                res.render('hotels/edit', {
                    hotel
                })
            } else {
                req.flash('error_msg', 'Not Authorized')
                res.redirect('/hotels')
            }
        })
})

// Edit Form Process
router.put('/:id', checkIfHotelExists, checkIfOwner, (req, res) => {
    Hotel.findOne({
        _id: req.params.id
    })
        .then(hotel => {
            // new values
            hotel.name = req.body.name
            hotel.description = req.body.description
            hotel.phone = req.body.phone
            hotel.email = req.body.email
            hotel.webpage = req.body.webpage
            hotel.price = req.body.price
            hotel.save().then(hotel => {
                req.flash('success_msg', 'Hotel updated')
                res.redirect('/hotels')
            })
        })
})

// Delete Hotel
router.delete('/:id', checkIfHotelExists, checkIfOwner, (req, res) => {
    // Delete every photo from AWS associated with this hotel
    Hotel.findOne({ _id: req.params.id}).then(hotel => {
        hotel.rooms.forEach(room => {
            room.roomImages.forEach(image =>{
                console.log(image)
                deleteImages(image.key)
            })
        })
        hotel.images.forEach(image => {
            deleteImages(image.key)
        })   
    })
    // Delete Hotel
    Hotel.findOneAndDelete({
        _id: req.params.id
    }).then(hotel => {
            req.flash('success_msg', 'Hotel removed')
            res.redirect('/hotels')
        }).catch(err => {
            req.flash('error_msg', err)
            res.redirect('/hotels')
        })
})

// Show Hotel
router.get('/show/:id', (req, res) => {
    let owner;
    Hotel.findOne({ _id: req.params.id}).then(hotel => {
        if(req.user) {
            owner = (hotel.user === req.user.id || res.locals.superadmin) ? true : false
        }
        res.render('hotels/show', { hotel, owner })
    })
})


module.exports = router