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
        res.status(500).json({ message: 'cannot add user'})
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

server.listen(PORT, () => {
    console.log(`\n** Server running on port ${PORT} **\n`)
})