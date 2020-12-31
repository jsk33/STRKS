const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const path = require('path')
const { requiresAuth } = require('express-openid-connect')
const { auth } = require('express-openid-connect')

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.AUTH_BASE_URL,
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL
};

const app = new express()

// MIDDLEWARES
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// routers
const targetsRouter = require('./routes/targets')
const userRouter = require('./routes/user')
app.use('/api/targets', targetsRouter)
app.use('/user', userRouter)

// set views if you want to use a template engine like pug
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// static files
app.use(express.static(path.join(__dirname, 'public')))


// HOMEPAGE routing
app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect('/user')
  } else {
    res.render('index', { title: 'Home' })
  }
})

// REWARDS routing
app.get('/rewards', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.render('rewards', { title: 'Rewards', authenticated: true })
  } else {
    res.render('rewards', { title: 'Rewards', autheticated: false })
  }
})

// ABOUT routing
app.get('/about', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.render('about', { title: 'About', authenticated: true })
  } else {
    res.render('about', { title: 'About', autheticated: false })
  }
})

// PROFILE routing; example of using 'requiresAuth()' middleware
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user.email))
})

// CONNECT TO DB
mongoose.connect(process.env.DATABASE_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.listen(process.env.PORT || 8000)