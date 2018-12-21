const   express = require('express'),
        path = require('path'),
        exphbs = require('express-handlebars'),
        mongoose = require('mongoose'),
        bodyParser = require('body-parser'),
        passport = require('passport'),
        methodOverride = require('method-override'),
        flash = require('connect-flash'),
        session = require('express-session'),
        helpers = require('handlebars-helpers')(),
        MongoStore = require('connect-mongo')(session),
        app = express();

// Load Hotel Model
require('./models/Hotel')
const Hotel = mongoose.model('hotels')

// Load routes
const hotels = require('./routes/hotels')
const users = require('./routes/users')
const rooms = require('./routes/rooms')
const photos = require('./routes/photos')

// Handlebars Helpers
const { truncate, stripTags } = require('./helpers/hbs')

// Passport Config
require('./config/passport')(passport)

// Connect to mongoose
mongoose.connect(mongoURI, {
    useNewUrlParser: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err))

// Handlebars middleware
app.engine('handlebars', exphbs({
    helpers: { truncate, stripTags },
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Static public folder
app.use(express.static(path.join(__dirname, 'public')))

// Method override middleware
app.use(methodOverride('_method'))

// Express session middleware
app.use(session({
    secret: 'my keyboard can use lights its pretty nice',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: mongoURI
    })
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Global variables
app.use(function(req, res, next){
    let superadmin, admin
    if (req.user) {
        superadmin = req.user.superadmin ? true : false
    }
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    res.locals.superadmin = superadmin
    next()
})



app.get('/', (req, res) => {
    Hotel.find({})
    .sort({ date: 'desc' })
    .then(hotels => {
        res.render('index', {
            hotels
        })
    })
})


// Use routes
app.use('/hotels', hotels)
app.use('/users', users)
app.use('/hotels/', photos)
app.use('/hotels/', rooms)


app.get('/*', (req, res) => {
    res.redirect('/')
})


const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
})