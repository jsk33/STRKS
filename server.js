const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

const targetsRouter = require('./routes/targets');

const app = new express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/targets', targetsRouter);

// HOMEPAGE
app.get('/', (req, res) => {
    res.send('Welcome to the Streaks RESTful API service.');
});

// CONNECT TO DB
mongoose.connect(
    process.env.CUSTOMCONNSTR_MyDBConnString, 
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => {console.log('connected to db')}
);

app.listen(process.env.PORT || 8000);