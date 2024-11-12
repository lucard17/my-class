/*

*/
CREATE TABLE test_lesson_students(
    lesson_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    visit BOOLEAN,
    PRIMARY KEY (lesson_id, student_id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE test_lesson_visits_count(
    lesson_id INTEGER PRIMARY KEY,
    visits INTEGER,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE test_lesson_students_count(
    lesson_id INTEGER PRIMARY KEY,
    students INTEGER,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

DROP TABLE IF EXISTS test_lesson_students_count;

DROP TABLE IF EXISTS test_lesson_visits_count;

DROP TABLE IF EXISTS test_lesson_students;


-------------------------------------------------------------------------------------------------------------


WITH st AS (
    SELECT
        id AS student_id,
        random() < 0.5 AS visit
    FROM students LIMIT 50
)
-- SELECT * FROM st
INSERT INTO test_lesson_students(lesson_id, student_id, visit)
SELECT 1, student_id, visit FROM st
;

SELECT * FROM test_lesson_students ORDER BY lesson_id, student_id;

TRUNCATE TABLE test_lesson_students;

UPDATE test_lesson_students SET visit = random() < 0.5
-- WHERE NOT visit
;

DELETE FROM test_lesson_students WHERE student_id BETWEEN 15 AND 35;

SELECT lesson_id, SUM(CASE WHEN visit = true THEN 1 ELSE 0 END) FROM test_lesson_students GROUP BY lesson_id;
SELECT * FROM test_lesson_visits_count;

SELECT lesson_id, COUNT(*) FROM test_lesson_students GROUP BY lesson_id;
SELECT * FROM test_lesson_students_count;


-------------------------------------------------------------------------------------------------------------


SET statement_timeout = 0;

UPDATE lesson_students
SET
    visit = lesson_students.visit
WHERE
    visit IS NOT NULL;


RESET statement_timeout;


-------------------------------------------------------------------------------------------------------------


SELECT lesson_id, SUM(
        CASE
            WHEN visit = TRUE THEN 1
            ELSE 0
        END
    )
FROM lesson_students
WHERE
    lesson_id < 50
GROUP BY
    lesson_id
ORDER BY lesson_id;

SELECT * FROM lesson_visits_count WHERE lesson_id < 50;