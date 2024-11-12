import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("lesson_visits_count", (table) => {
        table.integer("lesson_id").primary();
        table.integer("visits");
        table.foreign("lesson_id").references("lessons.id").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("lesson_visits_count");
}
