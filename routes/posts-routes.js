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

//add a comment to a post
router.post("/:id/comments", (req, res) => {
    const { id } = req.params
    const comment = req.body

    if (!comment.user_id) {
        comment['user_id'] = parseInt(id, 10)
    }

    if (!comment.post_id) {
        comment['post_id'] = parseInt(id, 10)
    }
    Users.findPostById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "Cannot Find Post" })
            }
            if (!comment.comment) {
                res.status(400).json({ message: "Cannot Add Empty Comment" })
            }
            Users.addComment(comment, id)
                .then(test => {
                    if(test){
                        res.status(200).json(test)
                    }
                })
                .catch(error => {
                    res.status(500).json({message: "Failed to add a Comment"})
                })
        })
        .catch(error => {
            res.status(500).json({message: "Failed to load Post"})
        })
})

module.exports = router