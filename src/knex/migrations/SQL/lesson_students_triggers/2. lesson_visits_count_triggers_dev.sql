--UP

CREATE OR REPLACE FUNCTION update_lesson_visits_and_students_count__trigger_fnc() RETURNS TRIGGER AS $$
DECLARE
    new_visits_count integer;
    new_students_count integer;
    affected_lesson_id integer := COALESCE(NEW.lesson_id, OLD.lesson_id);
BEGIN
    SELECT COUNT(*), SUM(CASE WHEN visit = true THEN 1 ELSE 0 END)
    INTO new_students_count, new_visits_count
    FROM test_lesson_students WHERE lesson_id = affected_lesson_id GROUP BY lesson_id;

    INSERT INTO test_lesson_visits_count (lesson_id, visits) VALUES (affected_lesson_id, new_visits_count)
    ON CONFLICT (lesson_id) DO UPDATE SET visits = new_visits_count
    WHERE EXCLUDED.visits != test_lesson_visits_count.visits;

    INSERT INTO test_lesson_students_count (lesson_id, students) VALUES (affected_lesson_id, new_students_count)
    ON CONFLICT (lesson_id) DO UPDATE SET students = new_students_count
    WHERE EXCLUDED.students != test_lesson_students_count.students;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION truncate_lesson_visits_and_students_count__trigger_fnc() RETURNS TRIGGER AS $$
BEGIN
    TRUNCATE TABLE test_lesson_visits_count;
    TRUNCATE TABLE test_lesson_students_count;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER after_lesson_students_insert__update_lesson_visits_and_students_count__trigger
AFTER INSERT ON test_lesson_students FOR EACH ROW EXECUTE PROCEDURE update_lesson_visits_and_students_count__trigger_fnc();

CREATE OR REPLACE TRIGGER after_lesson_students_update__update_lesson_visits_and_students_count__trigger
AFTER UPDATE ON test_lesson_students FOR EACH ROW EXECUTE PROCEDURE update_lesson_visits_and_students_count__trigger_fnc();

CREATE OR REPLACE TRIGGER after_lesson_students_delete__update_lesson_visits_and_students_count__trigger
AFTER DELETE ON test_lesson_students FOR EACH ROW EXECUTE PROCEDURE update_lesson_visits_and_students_count__trigger_fnc();

CREATE OR REPLACE TRIGGER after_lesson_students_truncate__truncate_lesson_visits_and_students_count__trigger
AFTER TRUNCATE ON test_lesson_students FOR EACH STATEMENT EXECUTE PROCEDURE truncate_lesson_visits_and_students_count__trigger_fnc();

--DOWN

DROP TRIGGER IF EXISTS after_lesson_students_truncate__truncate_lesson_visits_and_students_count__trigger ON test_lesson_students;

DROP TRIGGER IF EXISTS after_lesson_students_delete__update_lesson_visits_and_students_count__trigger ON test_lesson_students;

DROP TRIGGER IF EXISTS after_lesson_students_update__update_lesson_visits_and_students_count__trigger ON test_lesson_students;

DROP TRIGGER IF EXISTS after_lesson_students_insert__update_lesson_visits_and_students_count__trigger ON test_lesson_students;

DROP FUNCTION IF EXISTS truncate_lesson_visits_and_students_count__trigger_fnc();

DROP FUNCTION IF EXISTS update_lesson_visits_and_students_count__trigger_fnc();

-------------------------------------------------------------------------------------------------------------------------------------

WITH
    st AS (
        SELECT id AS student_id, random() < 0.5 AS visit
        FROM students
        LIMIT 50
    )
-- SELECT * FROM st
INSERT INTO
    test_lesson_students (lesson_id, student_id, visit)
SELECT 1, student_id, visit
FROM st;

UPDATE test_lesson_students
SET
    visit = random() < 0.5
WHERE
    RANDOM() < 0.5;

DELETE FROM test_lesson_students WHERE RANDOM() < 0.5;

SELECT * FROM test_lesson_students;

TRUNCATE TABLE test_lesson_students;

SELECT lesson_id, COUNT(*)
FROM test_lesson_students
WHERE
    visit = TRUE
GROUP BY
    lesson_id;

SELECT * FROM test_lesson_visits_count;

