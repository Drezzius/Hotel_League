const   express = require('express'),
        mongoose = require('mongoose'),
        bcrypt = require('bcryptjs'),
        passport = require('passport'),
        {checkIfSuperAdmin} = require('../helpers/auth'),
        router = express.Router();
        

// Load User Model
require('../models/User')
const User = mongoose.model('users')

// User login route
router.get('/login', (req, res) => {
    res.render('users/login')
})

router.get('/register', (req, res) => {
    res.render('users/register')
})

// Login form post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/')
})

// Register form Post
router.post('/register', (req, res) => {
    let errors = []
    if(req.body.password !== req.body.password2) {
        errors.push({ text: 'Passwords do not match' })
    }
    if(req.body.password.length < 4){
        errors.push({ text: 'Password must be at least 4 characters' })
    }
    if(errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })       
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if(user) {
                    req.flash('error_msg', 'Email already registered')
                    res.redirect('/users/register')
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success_msg', 'You are now registered and can log in')
                                res.redirect('/users/login')
                            }).catch(err => {
                                console.log(err)
                                return
                            })
                        })
                    }) 
                }
            }) 
    }
})

// GET ADMIN REGISTER FORM
router.get('/admin/register', checkIfSuperAdmin, (req, res) => {
    res.render('users/admin-register')
})

// ADMIN REGISTER, ONLY IF SUPERADMIN TRUE
router.post('/admin/register', checkIfSuperAdmin, (req, res) => {
    let errors = []
    if (req.body.password !== req.body.password2) {
        errors.push({ text: 'Passwords do not match' })
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' })
    }
    if (errors.length > 0) {
        res.render('users/admin-register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already registered')
                    res.redirect('/users/admin/register')
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        admin: true
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success_msg', 'Admin User registered and can log in')
                                res.redirect('/')
                            }).catch(err => {
                                console.log(err)
                                return
                            })
                        })
                    })
                }
            })
    }
})
module.exports = router