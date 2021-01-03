const express = require('express')
const session = require('express-session')
const userRouter = require('../routes/users-routes')
const postRouter = require('../routes/posts-routes')
const profileRouter = require('../routes/profile-routes')
const authRouter = require('../auth/auth-routes')
const restricted = require('../auth/restricted-middleware')

const server = express()

const sessionConfig = {
    name: 'joker',
    secret: process.env.SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // cookie active for 1 week
        secure: false, //set to true when deployed or in production for https only access
        httpOnly: true, //javascript can access cookie if set to false
    },
    resave: false,
    saveUninitialized: true, //GDPR laws mean must set to false when in deployed/production, user has to give consent when set to false
}

server.use(express.json())
server.use(session(sessionConfig))

server.get('/', (req, res) => {
    res.json({ message: 'Server Up and Running' })
})

server.use('/api/users', restricted, userRouter)
server.use('/api/posts', restricted, postRouter)
server.use('/api/profile', restricted, profileRouter)
server.use('/api/auth', authRouter)

module.exports = server