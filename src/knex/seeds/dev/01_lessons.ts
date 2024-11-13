/* eslint-disable no-console */
import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import config from "../dev.seeds.config.js";

// npm run knex:seed:run:specific -- 01_lessons.js
export async function seed(knex: Knex): Promise<void> {
    let lessons: { date: Date; title: string; status: 0 | 1 }[] = [];
    const skip = config.lessons.skip;
    const count = config.lessons.count;
    const countString = count.toLocaleString();
    const countStringLength = countString.length;

    console.log(`lessons seed: started with ${countString} records`);
    for (let i = skip + 1; i <= count; i++) {
        lessons.push({
            date: faker.date.between({ from: "2023-01-01", to: "2023-12-31" }),
            title: faker.lorem.word({ length: { min: 3, max: 10 } }),
            status: Math.random() < 0.5 ? 1 : 0,
        });
        if (i % 20000 === 0) {
            await knex("lessons").insert(lessons);
            console.log(`lessons seed: ${i.toLocaleString().padStart(countStringLength, " ")}/${countString} processed`);
            lessons = [];
        }
    }
    if (lessons.length > 0) await knex("lessons").insert(lessons);
    console.log(`lessons seed: completed with ${countString} records\n`);

    return;
}
