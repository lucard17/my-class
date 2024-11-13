import { Knex } from "knex";

declare module "knex/types/tables.js" {
    export interface Lesson {
        id: number;
        date: Date;
        title: string;
        status: 0 | 1;
    }
    export interface Student {
        id: number;
        name: string;
    }
    export interface Teacher {
        id: number;
        name: string;
    }
    export interface LessonTeacher {
        lesson_id: number;
        teacher_id: number;
    }
    export interface LessonStudent {
        lesson_id: number;
        student_id: number;
        visit: boolean;
    }

    export interface Tables {
        lessons: Lesson;
        lessons_composite: Knex.CompositeTableType<
            Lesson,
            Pick<Lesson, "title"> & (Pick<Lesson, "date"> | string) & Partial<Pick<Lesson, "status">>,
            Partial<Omit<Lesson, "id">>
        >;

        students: Student;
        students_composite: Knex.CompositeTableType<Student, Pick<Student, "name">, Partial<Omit<Student, "id">>>;

        teachers: Teacher;
        teachers_composite: Knex.CompositeTableType<Teacher, Pick<Teacher, "name">, Partial<Omit<Teacher, "id">>>;

        lesson_students: LessonStudent;
        lesson_students_composite: Knex.CompositeTableType<
            LessonStudent,
            Pick<LessonStudent, "lesson_id" | "student_id"> & Partial<Pick<LessonStudent, "visit">>,
            Partial<Omit<LessonStudent, "lesson_id" | "student_id">>
        >;

        lesson_teachers: LessonTeacher;
        lesson_teachers_composite: Knex.CompositeTableType<LessonTeacher, Pick<LessonTeacher, "lesson_id" | "teacher_id">>;
    }
}
