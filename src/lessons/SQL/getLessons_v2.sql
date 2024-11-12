-- Active: 1706810646063@@localhost@5430@my_class@public

WITH
    pagination AS (
        SELECT 10 AS page, 10 AS lessons_per_page 
    ),
    lids AS (
        SELECT id AS lesson_id FROM lessons WHERE date BETWEEN '2023-01-01' AND '2023-02-01'
        INTERSECT
        SELECT id AS lesson_id FROM lessons WHERE status = 1
        INTERSECT
        SELECT lesson_id FROM lesson_teachers WHERE teacher_id IN (2189)
        INTERSECT
        SELECT lesson_id FROM lesson_students_count WHERE students BETWEEN 3 AND 5

        -- SELECT id AS lesson_id FROM lessons
        
        ORDER BY lesson_id
        LIMIT 10
        -- OFFSET (10-1) * 10
    ),
    lesson_students_arr AS (
        SELECT lesson_id, json_agg(
                json_build_object(
                    'id', id, 'name', name, 'visit', visit
                )
            ) AS students
        FROM
            lids
            JOIN lesson_students USING (lesson_id)
            JOIN students ON students.id = lesson_students.student_id
        GROUP BY
            lesson_id
    ),
    lesson_teachers_arr AS (
        SELECT lesson_id, json_agg(
                json_build_object(
                    'id', teacher_id, 'name', name
                )
            ) AS teachers
        FROM
            lids
            JOIN lesson_teachers USING (lesson_id)
            JOIN teachers ON teachers.id = lesson_teachers.teacher_id
        GROUP BY
            lesson_id
    )
    -- SELECT * FROM lesson_students;
    -- SELECT * FROM lessons;
SELECT
    l.id,
    date::varchar,
    l.title,
    l.status,
    COALESCE(lvc.visits, 0) AS "visitsCount",
    COALESCE(lsa.students, '[]'::json) AS "students",
    COALESCE(lta.teachers, '[]'::json) AS "teachers"
FROM
    lids
    LEFT JOIN lessons l ON l.id = lids.lesson_id
    LEFT JOIN lesson_visits_count lvc USING (lesson_id)
    LEFT JOIN lesson_students_arr lsa USING (lesson_id)
    LEFT JOIN lesson_teachers_arr lta USING (lesson_id)
;