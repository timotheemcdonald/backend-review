
exports.up = function (knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments()
    tbl.string('username', 12)
      .notNullable()
      .unique()
      .index()
    tbl.string('password', 12)
      .notNullable()
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
  })
    .createTable('posts', tbl => {
      tbl.increments()
      tbl.string('title')
        .notNullable()
      tbl.text('post')
        .notNullable()
      tbl.timestamps(true, true)
      //foreign key to users
      tbl.integer('user_id')
        .notNullable()
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
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
    .createTable('comments', tbl => {
      tbl.increments()
      tbl.text('comment')
        .notNullable()
      tbl.timestamps(true, true)
      //foreign key to users
      tbl.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      //foreignkeytoposts
      tbl.integer('post_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('posts')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('comments').dropTableIfExists('profile').dropTableIfExists('posts').dropTableIfExists('users')
};
