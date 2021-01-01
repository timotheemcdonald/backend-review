const express = require('express')

const server = express()

server.use(express.json())

const PORT = 5000

server.get('/', (req, res) => {
    res.json({ message: 'Server Up and Running'})
})

server.listen(PORT, () => {
    console.log(`\n** Server running on port ${PORT} **\n`)
})