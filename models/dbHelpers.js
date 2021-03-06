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
    findUserComments,
    findProfileByUsername,
    findProfileById,
    findPostsComments,
    findAllPosts,
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
function findAllPosts(){
    return db("posts")
}

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

function findProfileByUsername(username){
    return db('users')
    .join('profile', 'users.id', 'profile.user_id')
    .join('posts', 'users.id', 'posts.user_id')
    .select(
        'users.username as username',
        'profile.profileName as profileName',
        'profile.bio as bio',
    )
    .where({username})
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

function findUserComments(user_id){
    return db("users")
    .join("comments", "users.id", "comments.user_id")
    .join("posts", "users.id", "posts.user_id")
    .select(
        "users.id",
        "users.username as username",
        "comments.comment",
        "comments.id",
        "posts.title"
    )
}