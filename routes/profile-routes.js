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
router.get('/username/:username', (req, res) => {
    const {username} = req.params

    Users.findProfileByUsername(username)
    .then(user => {
        if(user){
            res.status(200).json(user)
        }else{
            res.status(400).json({message: "Cannot find Profile associated with that Username"})
        }
    })
    .catch(error => {
        res.status(500).json({message: "Error looking up Profile for that Username"})
    })
})


module.exports = router