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

async function fetchTargets(req, res, next) {
    let targets; 

    if (process.env.NODE_ENV !== 'production') {
        targets = await fetch('http://localhost:8000/api/targets').then(res => res.json())
    } else {
        targets = await fetch('https://strks-web.herokuapp.com/api/targets').then(res => res.json())
    }

    res.targets = targets
    next()
}

// get

// post
router.post('/', postTarget, fetchTargets, (req, res) => {
    res.render('user', { title: "user", targets: res.targets })
})

async function postTarget(req, res, next) {

    if (process.env.NODE_ENV !== 'production') {
        try {
            targets = await fetch('http://localhost:8000/api/targets', {
                method: 'post',
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' }
            }).then(res => res.json())
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    } else {
        try {
            targets = await fetch('https://strks-web.herokuapp.com/api/targets', {
                method: 'post',
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' }
            }).then(res => res.json())
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    
    next()
}
// update

// delete

module.exports = router