const { json } = require('express');
const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const path = require('path')
const { requiresAuth } = require('express-openid-connect')
const { auth } = require('express-openid-connect')

// get all
router.get('/', requiresAuth(), (req, res) => {
    res.render('user', { title: "User" })
})

module.exports = router