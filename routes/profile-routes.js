const express = require('express')
const Users = require('../models/dbHelpers')

const router = express.Router()

//all endpoints are for api/profile

//find profile by profile id
router.get('/:id', (req, res) => {
    const {id} = req.params

    Users.findProfileById(id)
    .then(profile => {
        if(profile){
            res.status(200).json(profile)
        }else{
            res.status(404).json({message: "Cannot find Profile associated with that ID"})
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

//find profile by username
//this doesn't work
router.get('/:username', (req, res) => {
    const {username} = req.params

    Users.findProfileByUsername(username)
    .then(profile => {
        res.status(200).json(profile)
    })
    .catch(error => {
        res.status(505).json(error)
    })
})

module.exports = router