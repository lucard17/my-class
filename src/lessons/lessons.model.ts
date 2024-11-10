import KnexModel, { KnexModelResponse } from "../knex/knex.model.js";
import { LessonsGetQueryParams } from "./lessons.middewares.js";
import { and, having, SqlValuesArray, trimQuery, where } from "../utils/sql.utils.js";
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
    async getLessonsV1(params: LessonsGetQueryParams): Promise<KnexModelResponse<GetLessonsResponse>> {
        try {
            const { date, status, teacherIds, studentsCount, page, lessonsPerPage } = params;
            const values = new SqlValuesArray();

            const sql = trimQuery(`
                WITH
                    lessons AS (
                        SELECT
                            *
                        FROM lessons
                        ${where(and(date ? getDateStatement(date, values) : "", status ? `status = ${values.push(status)}` : ""))}
                    ),
                    lesson_students_count AS (
                        SELECT
                            lesson_id
                            , COUNT(*) AS students_count
                        FROM lesson_students
                        GROUP BY
                            lesson_id
                        ${having(studentsCount ? getStudentsCountStatement(studentsCount, values) : "")}
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
                            , SUM(CASE WHEN visit THEN 1 ELSE 0 END) AS visit_count
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
                        ${where(teacherIds ? getTeachersStatement(teacherIds, values) : "")}
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
                LIMIT ${values.push(lessonsPerPage)}
                ${page ? `OFFSET ${values.push((page - 1) * lessonsPerPage)}` : ""}
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
function getStudentsCountStatement(studentsCount: number[], values: SqlValuesArray) {
    if (studentsCount.length === 1) return `COUNT(*) = ${values.push(studentsCount[0])}`;
    if (studentsCount.length === 2) return `COUNT(*) BETWEEN ${values.push(studentsCount[0])} AND ${values.push(studentsCount[1])}`;
    return "";
}
function getTeachersStatement(teachers: number[], values: SqlValuesArray) {
    if (teachers.length === 1) return `teacher_id = ${values.push(teachers[0])}`;
    if (teachers.length > 1) return `teacher_id IN (${teachers.map((id) => values.push(id)).join(", ")})`;
    return "";
}
const lessonsModel = new Lessons();
export default lessonsModel;
