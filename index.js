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

server.listen(PORT, () => {
    console.log(`\n** Server running on port ${PORT} **\n`)
})