const express = require('express');
const router = express.Router();
const Target = require('../models/Target');
const { requiresAuth } = require('express-openid-connect')
const { auth } = require('express-openid-connect')


// GET ALL TARGETS 
router.get('/', requiresAuth(), async (req, res) => {
    try {
        const targets = await Target.find({ email: req.oidc.user.email })
        res.status(200).json(targets)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

// GET A SPECIFIC TARGET
router.get('/:targetID', requiresAuth(), async (req, res) => {
    try {
        const target = await Target.findById(req.params.targetID)
        res.status(200).json(target)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

// POST A TARGET
router.post('/', requiresAuth(), async (req, res) => {
    const newTarget = new Target( 
        {
            name: req.body.name,
            description: req.body.description,
            due: req.body.due,
            email: req.oidc.user.email
        } 
    )
    
    try {
        const savedTarget = await newTarget.save()
        res.status(200).json(savedTarget)
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
})

// UPDATE A TARGET
router.patch('/:targetID', requiresAuth(), async (req, res) => {
    const dataToUpdate = {
        count: req.body.count,
        due: req.body.due,
        status: req.body.status
    }

    try {
        const target = await Target.updateOne( 
            { _id: req.params.targetID },
            { $set: dataToUpdate }
            // for example: { $set: {name: req.body.name} }
        )
        res.status(200).json(target)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

// RESET COUNT WHEN DUE DATE HAS PASSED
// if you don't want to update every single key-value pair of the object
    // just see what you want to update from the req.body
    // need to make sure the req.body is an array of objects, instead of an object so that it can be iterable
    // the req.body should also specify the propName (ex. "prop name: name", if you want to update the name)
    // const updateOps = {};
    // for (const ops of req.body) {
    //     if (ops.propName === "due") {
    //         updateOps[ops.propName] = new Date(new Date().setHours(48, 0, 0, 0));
    //     } else {
    //         updateOps[ops.propName] = ops.value;
    //     }
    // }

// DELETE A TARGET
router.delete('/:targetID', requiresAuth(), async (req, res) => {
    try {
        const removedTarget = await Target.findOneAndRemove({_id: req.params.targetID}, {useFindAndModify: false});
        res.status(200).json(removedTarget)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router