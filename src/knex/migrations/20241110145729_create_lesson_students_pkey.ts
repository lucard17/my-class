import type { Knex } from "knex";
const primaryKeyName = "lesson_students_pkey";
export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("lesson_students", (table) => {
        table.primary(["lesson_id", "student_id"], { constraintName: primaryKeyName });
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("lesson_students", (table) => table.dropPrimary(primaryKeyName));
}
