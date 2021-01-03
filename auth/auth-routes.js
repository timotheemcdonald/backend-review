const express = require('express')
const Users = require('../models/dbHelpers')
const bcrypt = require('bcryptjs')

const router = express.Router()

//create a user
router.post('/register', (req, res) => {
    const credentials = req.body
    const {username, password} = credentials

    if(!(username && password)){
        return res.status(400).json({message: "Username and Password Required"})
    }

    const hash = bcrypt.hashSync(credentials.password, 12)
    credentials.password = hash

    Users.add(credentials)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(error => {
            if(error.error == 19){
                res.status(400).json({message: "Username Taken"})
            } else {
            res.status(500).json({ message: 'Error Registering User' })
            }
        })
})

//login as a user
router.post('/login', (req, res) => {
    const {username, password} = req.body

    if(!(username && password)){
        return res.status(400).json({message: "Username and Password Required"})
    }

    Users.findUserByUsername(username)
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)){
            req.session.user = {
                id: user.id,
                username: user.username
            }

            res.status(200).json({message: `Welcome ${user.username}`})
        }else{
            res.status(401).json({message: 'Invalid Credentials'})
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

router.get('/logout', (req, res) => {
    if(req.session){
        req.session.destroy(error => {
            if(error){
                res.status(500).json({message: "Error Logging Out"})
            } else {
                res.status(200).json({message: "User Logged Out"})
            }
        })
    } else {
        res.status(200).json({ message: "Not Logged In"})
    }
})

module.exports = router