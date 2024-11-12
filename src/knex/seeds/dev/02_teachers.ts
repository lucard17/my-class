/* eslint-disable no-console */
import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import config from "../dev.seeds.config.js";

// npm run knex:seed:run:specific -- 02_teachers.js
export async function seed(knex: Knex): Promise<void> {
    let teachers: { name: string }[] = [];
    const skip = config.teachers.skip;
    const count = config.teachers.count;
    const countString = count.toLocaleString();
    const countStringLength = countString.length;

    console.log(`teachers seed: started with ${countString} records`);
    for (let i = skip + 1; i <= count; i++) {
        teachers.push({
            name: faker.lorem.word({ length: { min: 3, max: 10 } }),
        });
        if (i % 10000 === 0) {
            await knex("teachers").insert(teachers);
            console.log(`teachers seed: ${i.toLocaleString().padStart(countStringLength, " ")}/${countString} processed`);
            teachers = [];
        }
    }
    if (teachers.length > 0) await knex("teachers").insert(teachers);
    console.log(`teachers seed: completed with ${countString} records\n`);

    return;
}
