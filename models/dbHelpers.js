//knex queries
const knex = require('knex')
const config = require('../knexfile')
const db = knex(config.development)

module.exports = {
    add,
    find,
    findById,
    remove,
    update,
    findPostById,
    addPost,
}

async function add(user){
   const [id] = await db('users').insert(user)

   return user
}

function find() {
    return db('users')
}

function findById(id){
    return db('users')
    .where({id})
    .first()
}

function remove(id){
    return db('users')
    .where({id})
    .del()
}

function update(id, changes){
    return db('users')
        .where({id})
        .update(changes, [id])
        .then( () => {
            return findById(id)
        })
}

function findPostById(id){
    return db("posts")
    .where({id})
    .first()
}

async function addPost(post, user_id){
    const [id] = await db("posts")
    .where({user_id})
    .insert(post)
    return findPostById(id);
}