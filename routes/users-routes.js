const express = require('express')
const Users = require('../models/dbHelpers')

const router = express.Router()

//all endpoints are for /api/users/
//create a user
router.post('/', (req, res) => {
    Users.add(req.body)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(error => {
            res.status(500).json({ message: 'Cannot add User' })
        })
})

//retrieve a user
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