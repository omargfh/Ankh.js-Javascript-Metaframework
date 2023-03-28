/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .dropTableIfExists('user_workout_exercise_sets')
        .dropTableIfExists('user_workout_exercises')
        .dropTableIfExists('user_workouts')
        .dropTableIfExists('workouts')
        .dropTableIfExists('user_settings')
        .dropTableIfExists('user_profile')
        .dropTableIfExists('users')
        .createTable('users', table => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.string('email', 255).notNullable();
        table.string('password', 255).notNullable();
        table.string('role', 255).notNullable();
        table.string('remember_token', 255).nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('user_profile', table => {
            table.increments('id').primary();
            table.integer('user_id').unsigned();
            table.foreign('user_id').references('users.id');
            table.date('dob').nullable();
            table.integer('height').defaultTo(165);
            table.timestamp('height_updated_at').defaultTo(knex.fn.now())
            table.integer('weight');
            table.timestamp('weight_updated_at').defaultTo(knex.fn.now())
            table.integer('body_fat');
            table.timestamp('body_fat_updated_at').defaultTo(knex.fn.now())
            table.integer('body_fat_goal');

            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('user_settings', table => {
            table.increments('id').primary();
            table.integer('user_id').unsigned();
            table.foreign('user_id').references('users.id');
            table.string('key', 255).notNullable();
            table.string('value', 255).notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('workouts', table => {
            table.increments('id').primary();
            table.string('name', 255).notNullable();
            table.string('description', 255).nullable();
            table.boolean('is_public').defaultTo(false);
            table.integer('user_id').unsigned();
            table.foreign('user_id').references('users.id');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('user_workouts', table => {
            table.increments('id').primary();
            table.integer('user_id').unsigned();
            table.foreign('user_id').references('users.id');
            table.integer('workout_id').unsigned();
            table.foreign('workout_id').references('workouts.id');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('user_workout_exercises', table => {
            table.increments('id').primary();
            table.integer('user_workout_id').unsigned();
            table.foreign('user_workout_id').references('user_workouts.id');
            table.integer('sets').defaultTo(1);
            table.integer('reps').defaultTo(1);

            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('user_workout_exercise_sets', table => {
            table.increments('id').primary();
            table.integer('user_workout_exercise_id').unsigned();
            table.foreign('user_workout_exercise_id').references('user_workout_exercises.id');
            table.integer('weight');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('user_workout_exercise_sets')
        .dropTable('user_workout_exercises')
        .dropTable('user_workouts')
        .dropTable('workouts')
        .dropTable('user_settings')
        .dropTable('user_profile')
        .dropTable('users');
};
