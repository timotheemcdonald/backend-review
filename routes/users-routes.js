const express = require('express')
const Users = require('../models/dbHelpers')

const router = express.Router()

//all endpoints are for /api/users
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
router.get('/username/:username', (req, res) => {
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

//get all posts by a specific user
router.get('/:id/posts', (req, res) => {
    const { id } = req.params

    Users.findById(id)
    .then(user => {
        if (user) {
            Users.findUserPosts(id)
            .then(posts => {
                if(posts){
                    res.status(200).json(posts)
                }else{
                    res.status(400).json({message: "No Posts associated with this User"})
                }
            })
            .catch(error => {
                res.status(500).json({ message: "Error retrieving Posts" })
            })
        } else {
            res.status(404).json({ message: 'Cannot find User with that ID' })
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'Cannot perform Operation' })
    })
})

//get all comments by a specific user
router.get('/:id/comments', (req, res) => {
    const {id} = req.params

    Users.findById(id)
    .then(user => {
        if (user) {
            Users.findUserComments(id)
            .then(comments => {
                if(comments){
                    res.status(200).json(comments)
                }else{
                    res.status(400).json({message: "No Comments associated with this User"})
                }
            })
            .catch(error => {
                res.status(500).json({message: "Error retrieving Comments"})
            })
        } else {
            res.status(404).json({ message: 'Cannot find User with that ID' })
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'Cannot perform Operation' })
    })

})

module.exports = router