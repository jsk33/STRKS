const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

const app = new express();

// IMPORT ROUTES

// MIDDLEWARES


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