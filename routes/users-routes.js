const express = require('express')
const Users = require('../models/dbHelpers')

const router = express.Router()

//all endpoints are for /api/users

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

//create a user's profile
router.post("/:id/profile", (req, res) => {
    const {id} = req.params
    const profile = req.body

    if(!profile.user_id){
        profile['user_id'] = parseInt(id, 10)
    }
    
    Users.findById(id)
    .then(user => {
        if(!user){
            res.status(404).json({message: "Invalid User ID"})
        }
        Users.addProfile(profile, id)
        .then(profile => {
            if(profile){
                res.status(200).json(profile)
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
    })
    .catch(error => {
        res.status(500).json({message: "Error finding User"})
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

module.exports = router