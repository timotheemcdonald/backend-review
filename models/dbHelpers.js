//knex queries
const knex = require('knex')
const config = require('../knexfile')
const db = knex(config.development)

module.exports = {
    add,
    find
}

async function add(user){
   const [id] = await db('users').insert(user)

   return id
}

function find() {
    return db('users')
}