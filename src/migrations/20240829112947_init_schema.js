export function up(knex) {
  return knex.schema
    .createTable('analytics', function(table) {
      table.increments('id').primary();
      table.integer('total_visits').defaultTo(0);
      table.integer('total_clicks').defaultTo(0);
    })
    .createTable('proxies', function(table) {
      table.increments('id').primary();
      table.string('proxy').unique().notNullable();
      table.integer('used').defaultTo(0);
      table.integer('fail').defaultTo(0); // Kolom untuk menandai proxy yang gagal
    })
    .createTable('fingerprints', function(table) {
        table.increments('id').primary();
        table.json('data').notNullable(); // Kolom JSON untuk menyimpan data fingerprint
        table.integer('used').defaultTo(0);
    });
}

export function down(knex) {
  return knex.schema
    .dropTableIfExists('analytics')
    .dropTableIfExists('proxies')
    .dropTableIfExists('fingerprints');
}
