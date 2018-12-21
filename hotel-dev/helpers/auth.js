const mongoose = require('mongoose')

// Load Hotel Model
require('../models/Hotel')
const Hotel = mongoose.model('hotels')

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        }
        req.flash('error_msg', 'Not Authorized')
        res.redirect('/users/login')
    },
    checkIfSuperAdmin: function(req, res, next) {
        if (req.isAuthenticated() && res.locals.superadmin) {
            return next()
        }
        req.flash('error_msg', 'Not Authorized')
        res.redirect('/')
    },
    checkIfAdmin: function(req, res, next) {
        if(req.isAuthenticated() && req.user.admin || res.locals.superadmin) {
            return next()
        }
        req.flash('error_msg', 'Not Authorized')
        res.redirect('/')
    },
    checkIfOwner: function(req, res, next) {
        if(req.isAuthenticated()) {
            Hotel.findOne({ _id: req.params.id }).then(hotel=>{
                if(hotel.user === req.user.id ||res.locals.superadmin) {
                    next()
                } else {
                    res.redirect('/')
                }
            })
        } else {
            req.flash('error_msg', 'Not Authorized')
            res.redirect('/users/login')
        }
    },
    checkIfHotelExists: function (req, res, next) {
        Hotel.findOne({ _id: req.params.id}, (err, hotel) => {
            if(hotel) {
                next()
            } else {
                req.flash('error_msg', 'Hotel not found!')
                res.redirect('/')
            }
        })
    }
}

