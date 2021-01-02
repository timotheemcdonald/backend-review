const express = require('express')
const Users = require('../models/dbHelpers')
const bcrypt = require('bcryptjs')

const router = express.Router()

//all endpoints are for /api/users/
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
            res.status(200).json({message: `Welcome ${user.username}`})
        }else{
            res.status(401).json({message: 'Invalid Credentials'})
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

//retrieve all users
router.get('/', (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json({ message: 'Unable to find Users' })
        })
})

//retrieve user by id
router.get('/:id', (req, res) => {
    const { id } = req.params

    Users.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ message: 'Cannot find User with that ID' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Cannot perform Operation' })
        })
})

//get user by username
router.get('/:username', (req, res) => {
    const {username} = req.params
    Users.findUserByUsername(username)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(error => {
        res.status(500).json({message: "Error Finding User by Username"})
    })
})

//delete a user, id required
router.delete('/:id', (req, res) => {
    const { id } = req.params

    Users.remove(id)
        .then(user => {
            if (user > 0) {
                res.status(200).json({ message: 'User Deleted' })
            } else {
                res.status(404).json({ message: 'Unable to Locate User for Deletion' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Unable to Perform Deletion' })
        })
})

//update user, need for changing password
router.patch('/:id', (req, res) => {
    const { id } = req.params
    const changes = req.body

    Users.update(id, changes)
        .then(user => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ message: 'User Not Found' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Error updating User' })
        })
})

//create a user's posts
router.post("/:id/posts", (req, res) => {
    const { id } = req.params
    const post = req.body

    if (!post.user_id) {
        post['user_id'] = parseInt(id, 10)
    }

    Users.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "Invalid User Id" })
            }
            if (!post.title || !post.post) {
                res.status(400).json({ message: "Must provide both Title and Post" })
            }
            Users.addPost(post, id)
                .then(post => {
                    if (post) {
                        res.status(200).json(post)
                    }
                })
                .catch(error => {
                    res.status(500).json({ message: "Failed to add Post" })
                })
        })
        .catch(error => {
            res.status(500).json({ message: "Error finding User" })
        })
})

//get all posts by a specific user
router.get('/:id/posts', (req, res) => {
    const { id } = req.params
    Users.findUserPosts(id)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json({ message: "Error retrieving Posts" })
        })
})

module.exports = router