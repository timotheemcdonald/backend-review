// //knex queries
// const knex = require('knex')
// const config = require('../knexfile')
// const db = knex(config.development)

const db = require('../dbConfig')

module.exports = {
    add,
    find,
    findById,
    remove,
    update,
    findPostById,
    addPost,
    findUserPosts,
    updatePost,
    removePost,
    findUserByUsername,
    findPostByTitle,
    addComment,
    addProfile,
    findProfileByUsername,
    findProfileById,
    findPostsComments,
}

//user helpers
async function add(user) {
    const [id] = await db('users').insert(user)

    return user
}

function find() {
    return db('users')
}

function findUserByUsername(username){
    return db("users").where({username}).first()
}

function findById(id) {
    return db('users')
        .where({ id })
        .first()
}

function remove(id) {
    return db('users')
        .where({ id })
        .del()
}

function update(id, changes) {
    return db('users')
        .where({ id })
        .update(changes, [id])
        .then(() => {
            return findById(id)
        })
}

//post helpers
function findPostById(id) {
    return db("posts")
        .where({ id })
        .first()
}

function findPostByTitle(title){
    return db("posts").where({title}).first()
}

async function addPost(post, user_id) {
    const [id] = await db("posts")
        .where({ user_id })
        .insert(post)
    return findPostById(id);
}

function findUserPosts(user_id) {
    return db("users")
        .join("posts", "users.id", "posts.user_id")
        .select(
            "users.id as userID",
            "users.username as username",
            "posts.id as postID",
            "posts.title",
            "posts.post"
        )
        .where({ user_id })
}


function updatePost(id, changes) {
    return db("posts")
        .where({ id })
        .update(changes, [id])
        .then(() => {
            return findPostById(id)
        })
}

function removePost(id) {
    return db("posts")
        .where({ id })
        .del();
}

//profile helpers
function findProfileById(id){
    return db('profile')
    .where({id})
}

async function addProfile(profile, user_id){
    const [id] = await db("profile")
    .where({user_id})
    .insert(profile)
    return findProfileById(id);
}


//this doesn't work
function findProfileByUsername(user_id){
    return db("users")
    .join("profile", "users.id", "profile.user_id" )
    // .join("posts", "posts.id", "profile.post_id")
    .select(
        "users.id as userID",
        "users.username",
        "profile.id as profileID",
        "profile.profileName",
        "profile.bio",
        // "posts.title",
        // "posts.id as postID"
    )
    .where({ user_id })
}

//comment helpers
function findCommentById(id){
    return db('comments')
    .where({id})
}

async function addComment(comment, post_id, user_id){
    const [id] = await db("comments")
    .where({ post_id, user_id })
    .insert(comment)
    return findCommentById(id)
}

function findPostsComments(post_id){
    return db("posts")
    .join("comments", "posts.id", "comments.post_id")
    .join("users", "users.id", "comments.user_id")
    .select(
        "users.id as userID",
        "users.username as username",
        "posts.id as postID",
        "posts.title",
        "comments.comment",
        "comments.id"
    )
    .where({post_id})
}