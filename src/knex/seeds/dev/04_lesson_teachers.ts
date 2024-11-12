/* eslint-disable no-console */
import { Knex } from "knex";
import config from "../dev.seeds.config.js";

// npm run knex:seed:run:specific -- 04_lesson_teachers.js
export async function seed(knex: Knex): Promise<void> {
    let lessonsTeachers: { lesson_id: number; teacher_id: number }[] = [];
    const skip = config.lessons.skip;
    const lessonsCount = config.lessons.count; // занятий
    const lessonsCountString = lessonsCount.toLocaleString();
    const lessonsCountStringLength = lessonsCountString.length;
    let l: number, teacherCount: number;
    let counter = 0;

    console.log(`lesson_teachers seed: started with ${lessonsCount} lessons, and 0...${config.lessons.teachers} teachers per lesson`);
    for (l = skip + 1; l <= lessonsCount; l++) {
        teacherCount = Math.floor(Math.random() * config.lessons.teachers);
        const lessonTeachersIds: number[] = [];
        while (lessonTeachersIds.length < teacherCount) {
            const teacherId = Math.ceil(Math.random() * config.teachers.count) ?? 1;
            if (!lessonTeachersIds.includes(teacherId)) lessonTeachersIds.push(teacherId);
        }
        for (const teacherId of lessonTeachersIds) {
            lessonsTeachers.push({
                lesson_id: l,
                teacher_id: teacherId,
            });

            if (lessonsTeachers.length > 20000) {
                await knex("lesson_teachers").insert(lessonsTeachers);
                lessonsTeachers = [];
            }
        }
        if (l % 20000 === 0) {
            console.log(`lesson_teachers seed: ${l.toLocaleString().padStart(lessonsCountStringLength, " ")}/${lessonsCountString} lessons processed`);
        }
    }
    if (lessonsTeachers.length > 0) await knex("lesson_teachers").insert(lessonsTeachers);
    console.log(`lesson_teachers seed: completed with ${counter} records\n`);

    return;
}
