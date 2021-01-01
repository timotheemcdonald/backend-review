
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
      tbl.increments()
      tbl.string('username', 12)
      .notNullable()
      .unique()
      tbl.string('password', 12)
      .notNullable()
      tbl.timestamps(true, true)
  })
  .createTable('posts', tbl => {
      tbl.increments()
      tbl.string('title')
      .notNullable()
      tbl.text('postContent')
      .notNullable()
      tbl.timestamps(true, true)
    //foreign key to users
      tbl.integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
  .createTable('profile', tbl => {
      tbl.increments()
      tbl.string('profileName')
      tbl.text('bio')
      //foreign key to users
      tbl.integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      //foreign key to posts
      tbl.integer('post_id')
      .unsigned()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('profile').dropTableIfExists('posts').dropTableIfExists('users')
};
