import KnexModel, { KnexModelResponse } from "../knex/knex.model.js";
import { LessonsGetQueryParams } from "./lessons.middewares.js";
import { SqlValuesArray, trimQuery, intersect } from "../utils/sql.utils.js";
import { knexLogger as log } from "../logger/logger.service.js";
import type { GetLessonsResponse } from "./lessons.types.js";

class Lessons extends KnexModel {
    constructor() {
        const primaryKey = ["id"];
        super({
            tableName: "lessons",
            primaryKey: primaryKey,
            fields: [...primaryKey, "date", "title", "status"],
            modelName: "Lessons",
        });
    }

    async getLessons(params: LessonsGetQueryParams): Promise<KnexModelResponse<GetLessonsResponse>> {
        try {
            const { date, status, teacherIds, studentsCount, page, lessonsPerPage } = params;
            const values = new SqlValuesArray();
            const isNoConditions = !(date || status || teacherIds || studentsCount);
            const sql = trimQuery(`
                WITH
                    lids AS (
                        ${intersect(
                            isNoConditions ? `SELECT id AS lesson_id FROM lessons` : ``,
                            date ? `SELECT id AS lesson_id FROM lessons WHERE ${getDateStatement(date, values)}` : ``,
                            status ? `SELECT id AS lesson_id FROM lessons WHERE status = ${values.push(status)}` : ``,
                            teacherIds ? `SELECT lesson_id FROM lesson_teachers WHERE ${getTeachersStatement(teacherIds, values)}` : ``,
                            studentsCount ? `SELECT lesson_id FROM lesson_students_count WHERE ${getStudentsStatement(studentsCount, values)}` : ``,
                        )}
                        ORDER BY lesson_id
                        LIMIT ${values.push(lessonsPerPage)}
                        ${page ? `OFFSET ${values.push((page - 1) * lessonsPerPage)}` : ""}
                    )
                    , lesson_students_arr AS (
                        SELECT
                            lesson_id
                            , json_agg(
                                json_build_object(
                                    'id', id, 'name', name, 'visit', visit
                                )
                            ) AS students
                        FROM lids
                            JOIN lesson_students USING (lesson_id)
                            JOIN students ON students.id = lesson_students.student_id
                        GROUP BY
                            lesson_id
                    )
                    , lesson_teachers_arr AS (
                        SELECT
                            lesson_id
                            , json_agg(
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
                SELECT
                    l.id
                    , date::varchar
                    , l.title
                    , l.status
                    , COALESCE(lvc.visits, 0) AS "visitsCount"
                    , COALESCE(lsa.students, '[]'::json) AS "students"
                    , COALESCE(lta.teachers, '[]'::json) AS "teachers"
                FROM
                    lids
                    LEFT JOIN lessons l ON l.id = lids.lesson_id
                    LEFT JOIN lesson_visits_count lvc USING (lesson_id)
                    LEFT JOIN lesson_students_arr lsa USING (lesson_id)
                    LEFT JOIN lesson_teachers_arr lta USING (lesson_id)
                ORDER BY id
            ;`);
            log.trace(`[${this.name}][getLessonsV1] sql:\n`, sql, `values: \n`, JSON.stringify(values));
            const res = await this.knex.raw(sql, values);
            return res.rows;
        } catch (error) {
            log.error(`[${this.name}][getLessonsV1]:`, error);
            if (error instanceof Error) return this.handleError(error);
            throw error;
        }
    }
}

function getDateStatement(date: string[], values: SqlValuesArray) {
    if (date.length === 1) return `date = ${values.push(date[0])}::DATE`;
    if (date.length === 2) return `date BETWEEN ${values.push(date[0])}::DATE AND ${values.push(date[1])}::DATE`;
    return "";
}

function getStudentsStatement(studentsCount: number[], values: SqlValuesArray) {
    if (studentsCount.length === 1) return `students = ${values.push(studentsCount[0])}`;
    if (studentsCount.length === 2) return `students BETWEEN ${values.push(studentsCount[0])} AND ${values.push(studentsCount[1])}`;
    return "";
}

function getTeachersStatement(teachers: number[], values: SqlValuesArray) {
    if (teachers.length === 1) return `teacher_id = ${values.push(teachers[0])}`;
    if (teachers.length > 1) return `teacher_id IN (${teachers.map((id) => values.push(id)).join(", ")})`;
    return "";
}
const lessonsModel = new Lessons();
export default lessonsModel;
