const express = require('express')
const Users = require('../models/dbHelpers')

const router = express.Router()

//all endpoints are for /api/public

//posts

//find all posts
router.get('/posts', (req, res) => {
    Users.findAllPosts()
    .then(post =>{
        res.status(200).json(post)
    })
    .catch(error => {
        res.status(500).json({message: "Error Finding Posts"})
    })
})

//find post by title
router.get('/posts/find/:title', (req, res) => {
    const {title} = req.params
    Users.findPostByTitle(title)
    .then(title => {
        res.status(200).json(title)
    })
    .catch(error => {
        res.status(500).json({message: "Error Finding Post by Title"})
    })
})

//find post by id
router.get('/posts/:id', (req, res) => {
    const {id} = req.params
    Users.findPostById(id)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(error => {
        res.status(500).json({message: "Error finding Post by ID"})
    })
})

//get all of a posts comments
router.get('/posts/:id/comments', (req, res) => {
    const { id } = req.params

    Users.findPostById(id)
    .then(post => {
        if (!post) {
            res.status(404).json({ message: "Invalid Post Id" })
        }
        Users.findPostsComments(id)
        .then(comments => {
            res.status(200).json(comments)
        })
        .catch(error => {
            res.status(500).json(error)
        })
    })
    .catch(error => {
        res.status(500).json({message: "Error finding Post by ID"})
    })

})



//users
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
router.get('users/:id/comments', (req, res) => {
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

//retrieve all users
router.get('/users/', (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json({ message: 'Unable to find Users' })
        })
})

//retrieve user by id
router.get('/usersbyid/:id', (req, res) => {
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
router.get('/users/:username', (req, res) => {
    const {username} = req.params
    Users.findUserByUsername(username)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(error => {
        res.status(500).json({message: "Error Finding User by Username"})
    })
})


//profile

//find profile by profile id
router.get('/profilebyid/:id', (req, res) => {
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
router.get('/profile/:username', (req, res) => {
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