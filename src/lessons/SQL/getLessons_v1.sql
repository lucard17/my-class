-- Active: 1706810646063@@127.0.0.1@5430@my_class

WITH
    lessons AS (
        SELECT 
            *
        FROM lessons
        WHERE
            -- date = '2019-09-02'
            date BETWEEN '2019-09-01' AND '2019-09-02'
    ),
    lesson_students_count AS (
        SELECT
            lesson_id
            , COUNT(*) AS students_count
        FROM lesson_students
        GROUP BY
            lesson_id
        HAVING
            COUNT(*) = 2
            -- COUNT(*) BETWEEN 1 AND 2
    ),
    lesson_students AS (
        SELECT 
            *
        FROM lesson_students
            JOIN students ON students.id = lesson_students.student_id
    ),
    lesson_visits AS (
        SELECT
            lesson_id
            , SUM(
                CASE
                    WHEN visit THEN 1
                    ELSE 0
                END
            ) AS visit_count
        FROM lesson_students
        GROUP BY
            lesson_id
    ),
    lesson_students_arr AS (
        SELECT
            lesson_id
            , json_agg(
                json_build_object(
                    'id', id, 'name', name, 'visit', visit
                )
            ) AS students
        FROM lesson_students
        GROUP BY
            lesson_id
    ),
    lesson_teachers_filter AS (
        SELECT 
            lesson_id
            , teacher_id
        FROM lesson_teachers
        WHERE
            -- teacher_id = 1
            teacher_id IN (1, 2, 3)
    ),
    lesson_teachers_arr AS (
        SELECT 
            lesson_id
            , json_agg(
                json_build_object(
                    'id', teacher_id, 'name', name
                )
            ) AS teachers
        FROM
            lesson_teachers_filter
            JOIN teachers ON teachers.id = lesson_teachers_filter.teacher_id
        GROUP BY
            lesson_id
    )
    -- SELECT * FROM lesson_students;
SELECT 
    id
    , date::varchar
    , title
    , status
    , lv.visit_count AS "visitsCount"
    , lsa.students
    , lta.teachers
FROM
    lessons l
    JOIN lesson_students_count sc ON sc.lesson_id = l.id
    JOIN lesson_visits lv ON lv.lesson_id = l.id
    JOIN lesson_students_arr lsa ON lsa.lesson_id = l.id
    JOIN lesson_teachers_arr lta ON lta.lesson_id = l.id
ORDER BY id
;