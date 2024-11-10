import type { LessonStudent, Student, Teacher, Lesson } from "knex/types/tables.js";

export interface GetLessonsResponseItem extends Lesson {
    visitsCount: number;
    students: (Student & Pick<LessonStudent, "visit">)[];
    teachers: Teacher[];
}
export type GetLessonsResponse = GetLessonsResponseItem[];
