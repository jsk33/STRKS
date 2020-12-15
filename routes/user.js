const { json } = require('express');
const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const path = require('path')


// get all
router.get('/', fetchTargets, (req, res) => {
    res.render('user', { title: "strks", targets: res.targets})
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

// update

// delete

module.exports = router