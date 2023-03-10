const path = require('path')
const express = require('express')
// const mongoose = require('mongoose') // not required anymore
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require("method-override");
const passport = require('passport')
const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const { Mongoose, default: mongoose } = require('mongoose') // where did I get this from?

// Load config for gloabal variables
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Use forms for put / delete
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))


// Loggin
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// Handlebars
// use exphbs.engine instead of only exphbs bcos the later throws an error.
app.engine('.hbs', exphbs.engine({ helpers: {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select
}, 
defaultLayout: 'main', 
extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.DB_STRING 
  })
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// set global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
// app.use('/logout', require('./routes/logout')) // not needed

const PORT = process.env.PORT || 3000

app.listen(
    PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)