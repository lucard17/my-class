import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE OR REPLACE FUNCTION update_lesson_visits_and_students_count__trigger_fnc() RETURNS TRIGGER AS $$
        DECLARE
            new_visits_count integer;
            new_students_count integer;
            affected_lesson_id integer := COALESCE(NEW.lesson_id, OLD.lesson_id);
        BEGIN
            SELECT COUNT(*), SUM(CASE WHEN visit = true THEN 1 ELSE 0 END)
            INTO new_students_count, new_visits_count
            FROM lesson_students WHERE lesson_id = affected_lesson_id GROUP BY lesson_id;

            INSERT INTO lesson_visits_count (lesson_id, visits) VALUES (affected_lesson_id, new_visits_count)
            ON CONFLICT (lesson_id) DO UPDATE SET visits = new_visits_count
            WHERE EXCLUDED.visits != lesson_visits_count.visits;

            INSERT INTO lesson_students_count (lesson_id, students) VALUES (affected_lesson_id, new_students_count)
            ON CONFLICT (lesson_id) DO UPDATE SET students = new_students_count
            WHERE EXCLUDED.students != lesson_students_count.students;

            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE FUNCTION truncate_lesson_visits_and_students_count__trigger_fnc() RETURNS TRIGGER AS $$
        BEGIN
            TRUNCATE TABLE lesson_visits_count;
            TRUNCATE TABLE lesson_students_count;
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE TRIGGER after_lesson_students_insert__update_lesson_visits_and_students_count__trigger
        AFTER INSERT ON lesson_students FOR EACH ROW EXECUTE PROCEDURE update_lesson_visits_and_students_count__trigger_fnc();

        CREATE OR REPLACE TRIGGER after_lesson_students_update__update_lesson_visits_and_students_count__trigger
        AFTER UPDATE ON lesson_students FOR EACH ROW EXECUTE PROCEDURE update_lesson_visits_and_students_count__trigger_fnc();

        CREATE OR REPLACE TRIGGER after_lesson_students_delete__update_lesson_visits_and_students_count__trigger
        AFTER DELETE ON lesson_students FOR EACH ROW EXECUTE PROCEDURE update_lesson_visits_and_students_count__trigger_fnc();

        CREATE OR REPLACE TRIGGER after_lesson_students_truncate__truncate_lesson_visits_and_students_count__trigger
        AFTER TRUNCATE ON lesson_students FOR EACH STATEMENT EXECUTE PROCEDURE truncate_lesson_visits_and_students_count__trigger_fnc();
    `)
}


export async function down(knex: Knex): Promise<void> {
    return knex.raw(`
        DROP TRIGGER IF EXISTS after_lesson_students_truncate__truncate_lesson_visits_and_students_count__trigger ON lesson_students;

        DROP TRIGGER IF EXISTS after_lesson_students_delete__update_lesson_visits_and_students_count__trigger ON lesson_students;

        DROP TRIGGER IF EXISTS after_lesson_students_update__update_lesson_visits_and_students_count__trigger ON lesson_students;

        DROP TRIGGER IF EXISTS after_lesson_students_insert__update_lesson_visits_and_students_count__trigger ON lesson_students;

        DROP FUNCTION IF EXISTS truncate_lesson_visits_and_students_count__trigger_fnc();

        DROP FUNCTION IF EXISTS update_lesson_visits_and_students_count__trigger_fnc();
    `)
}

