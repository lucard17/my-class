/* eslint-disable no-console */
import { Knex } from "knex";
import config from "../dev.seeds.config.js";

// npm run knex:seed:run:specific -- 05_lesson_students.js
export async function seed(knex: Knex): Promise<void> {
    let lessonsStudents: { lesson_id: number; student_id: number; visit: boolean }[] = [];
    const skip = config.lessons.skip;
    const lessonsCount = config.lessons.count; // занятий
    const lessonsCountString = lessonsCount.toLocaleString();
    const lessonsCountStringLength = lessonsCountString.length;
    let l: number, studentsCount: number;
    let counter = 0;
    
    console.log(`lesson_students seed: started with ${lessonsCount} lessons, and 0...${config.lessons.students} students per lesson`);
    for (l = skip + 1; l <= lessonsCount; l++) {
        studentsCount = Math.floor(Math.random() * config.lessons.students);
        const lessonStudentsIds: number[] = [];
        while (lessonStudentsIds.length < studentsCount) {
            const teacherId = Math.ceil(Math.random() * config.students.count) ?? 1;
            if (!lessonStudentsIds.includes(teacherId)) lessonStudentsIds.push(teacherId);
        }
        for (const studentId of lessonStudentsIds) {
            lessonsStudents.push({
                lesson_id: l,
                student_id: studentId,
                visit: Math.random() > 0.3,
            });
            counter++;
        }

        if (lessonsStudents.length > 20000) {
            await knex("lesson_students").insert(lessonsStudents);
            lessonsStudents = [];
        }
        if (l % 20000 === 0) {
            console.log(`lesson_students seed: ${l.toLocaleString().padStart(lessonsCountStringLength, " ")}/${lessonsCountString} lessons processed`);
        }
    }

    if (lessonsStudents.length > 0) await knex("lesson_students").insert(lessonsStudents);
    console.log(`lesson_students seed: completed with ${counter} records\n`);

    return;
}
