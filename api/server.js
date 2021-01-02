const express = require('express')
const userRouter = require('../routes/users-routes')
const postRouter = require('../routes/posts-routes')

const server = express()

server.use(express.json())


server.get('/', (req, res) => {
    res.json({ message: 'Server Up and Running' })
})

server.use('/api/users', userRouter)
server.use('/api/posts', postRouter)


module.exports = server