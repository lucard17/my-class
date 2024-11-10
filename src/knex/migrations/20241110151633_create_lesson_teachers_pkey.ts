import type { Knex } from "knex";
const primaryKeyName = "lesson_teachers_pkey";
export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("lesson_teachers", (table) => {
        table.primary(["lesson_id", "teacher_id"], { constraintName: primaryKeyName });
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("lesson_teachers", (table) => table.dropPrimary(primaryKeyName));
}
