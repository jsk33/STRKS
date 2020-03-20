const express = require('express');
const router = express.Router();
const Target = require('../models/Target');

// GET ALL TARGETS 
router.get('/', async (req, res) => {
    try {
        const targets = await Target.find();
        res.json(targets).status(200);
    } catch(err) {
        res.json({error: err}).status(500);
    }
});

// GET A SPECIFIC TARGET


// POST A TARGET
router.post('/', async (req, res) => {
    const newTarget = new Target( 
        {
            name: req.body.name,
            description: req.body.description
        } 
    );
    
    try {
        const savedTarget = await newTarget.save();
        res.json(savedTarget).status(200);
    } catch(err) {
        res.json({error: err}).status(500);
    }
});

// UPDATE A TARGET


// DELETE A TARGET



  
module.exports = router;