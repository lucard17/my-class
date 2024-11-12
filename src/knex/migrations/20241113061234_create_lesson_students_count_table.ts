import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("lesson_students_count", (table) => {
        table.integer("lesson_id").primary();
        table.integer("students");
        table.foreign("lesson_id").references("lessons.id").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("lesson_students_count");
}
