import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // только для того чтобы на стартовых данных отработали триггеры
    await knex.raw(`UPDATE lesson_students SET visit = lesson_students.visit WHERE visit IS NOT NULL;`);
    return;
}

export async function down(knex: Knex): Promise<void> {
    return;
}
