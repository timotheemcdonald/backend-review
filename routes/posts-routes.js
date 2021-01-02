const express = require('express')
const Users = require('../models/dbHelpers')

const router = express.Router()

//all endpoints are for /api/posts
//edit a post, id required
router.patch('/:id', (req, res) => {
    const { id } = req.params
    const changes = req.body

    Users.findPostById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "Invalid Post Id" })
            }

            Users.updatePost(id, changes)
                .then(post => {
                    if (post) {
                        res.status(200).json(post)
                    } else {
                        res.status(404).json({ message: 'Post not found' })
                    }
                })
                .catch(error => {
                    res.status(500).json({ message: "Error Updating Post" })
                })
        })
        .catch(error => {
            res.status(500).json({ message: "Error Finding Post" })
        })
})

//delete a post, id required
router.delete("/:id", (req, res) => {
    const { id } = req.params

    Users.removePost(id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: `Post with id ${id} successfully deleted` })
            } else {
                res.status(404).json({ message: "Couldn't find Post to delete" })
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Error Deleting Post" })
        })
})

module.exports = router