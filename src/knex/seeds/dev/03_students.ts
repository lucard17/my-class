/* eslint-disable no-console */
import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import config from "../dev.seeds.config.js";

// npm run knex:seed:run:specific -- 03_students.js
export async function seed(knex: Knex): Promise<void> {
    let students: { name: string }[] = [];
    const skip = config.students.skip;
    const count = config.students.count;
    const countString = count.toLocaleString();
    const countStringLength = countString.length;
    console.log(`students seed: started with ${countString} records`);
    for (let i = skip + 1; i <= count; i++) {
        students.push({
            name: faker.lorem.word({ length: { min: 3, max: 10 } }),
        });
        if (i % 10000 === 0) {
            await knex("students").insert(students);
            console.log(`students seed: ${i.toLocaleString().padStart(countStringLength, " ")}/${countString} processed`);
            students = [];
        }
    }
    if (students.length > 0) await knex("students").insert(students);
    console.log(`students seed: completed with ${countString} records\n`);

    return;
}
