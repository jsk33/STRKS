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
router.get('/:targetID', async (req, res) => {
    try {
        const target = await Target.findById(req.params.targetID);
        res.json(target).status(200);
    } catch(err) {
        res.json({error: err}).status(500);
    }
});

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
router.patch('/:targetID', async (req, res) => {
    // if you don't want to update every single key-value pair of the object
    // just see what you want to update from the req.body
    // need to make sure the req.body is an array of objects, instead of an object so that it can be iterable
    // the req.body should also specify the propName (ex. "prop name: name", if you want to update the name)
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    
    try {
        const target = await Target.updateOne( 
            { _id: req.params.targetID },
            { $set: updateOps }
            // for example: { $set: {name: req.body.name} }
        );
        res.json(target).status(200);
    } catch(err) {
        res.json({error: err}).status(500);
    }
});

// DELETE A TARGET
router.delete('/:targetID', async (req, res) => {
    try {
        const removedTarget = await Target.findOneAndRemove({_id: req.params.targetID}, {useFindAndModify: false});
        res.json(removedTarget).status(200);
    } catch(err) {
        res.json({error: err}).status(500);
    }
});


  
module.exports = router;