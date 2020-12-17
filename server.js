const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const path = require('path')

const app = new express()

// MIDDLEWARES
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
    res.render('index', {title: 'Home'})
})

// CONNECT TO DB
mongoose.connect(process.env.DATABASE_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.listen(process.env.PORT || 8000)