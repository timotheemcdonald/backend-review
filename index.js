const express = require('express')
const Users = require('./models/dbHelpers')

const server = express()

server.use(express.json())

const PORT = 5000

server.get('/', (req, res) => {
    res.json({ message: 'Server Up and Running'})
})

server.post('/api/users', (req, res) => {
    Users.add(req.body)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(error => {
        res.status(500).json({ message: 'Cannot add User'})
    })
})

server.get('/api/users', (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        res.status(500).json({message: 'Unable to find Users'})
    })
})

server.get('/api/users/:id', (req, res) => {
    const {id} = req.params

    Users.findById(id)
    .then(user => {
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({ message: 'Cannot find User with that ID'})
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'Cannot perform Operation'})
    })
})

server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params

    Users.remove(id)
        .then(user => {
            if(user > 0){
                res.status(200).json({message: 'User Deleted'})
            } else {
                res.status(404).json({message: 'Unable to Locate User for Deletion'})
            }
        })
        .catch(error => {
            res.status(500).json({message: 'Unable to Perform Deletion'})
        })
})

server.patch('/api/users/:id', (req, res) => {
    const {id} = req.params
    const changes = req.body

    Users.update(id, changes)
    .then(user => {
        if(user){
            res.status(200).json(user)
        } else {
            res.status(404).json({message: 'User Not Found'})
        }
    })
    .catch(error => {
        res.status(500).json({message: 'Error updating User'})
    })
})

server.post("/api/users/:id/posts", (req, res) => {
    const {id} = req.params
    const post = req.body

    if(!post.user_id){
        post['user_id'] = parseInt(id, 10)
    }

    Users.findById(id)
    .then(user => {
        if(!user){
            res.status(404).json({message: "Invalid User Id"})
        }
        if(!post.title || !post.post){
            res.status(400).json({message: "Must provide both Title and Post"})
        }
        Users.addPost(post, id)
        .then(post => {
            if(post){
                res.status(200).json(post)
            }
        })
        .catch(error => {
            res.status(500).json({message: "Failed to add Post"})
        })
    })
    .catch(error => {
        res.status(500).json({message: "Error finding User"})
    })
})

server.listen(PORT, () => {
    console.log(`\n** Server running on port ${PORT} **\n`)
})