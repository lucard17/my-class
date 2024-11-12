const POSTGRES_DB = process.env.POSTGRES_DB;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const PGPORT = process.env.PGPORT;

/**@type {import("knex").Knex.Config} */
let config;
if (process.env.NODE_ENV === "production") {
    if (!POSTGRES_DB) throw new Error("POSTGRES_DB is not defined");
    if (!POSTGRES_USER) throw new Error("POSTGRES_USER is not defined");
    if (!POSTGRES_PASSWORD) throw new Error("POSTGRES_PASSWORD is not defined");
    if (!POSTGRES_HOST) throw new Error("POSTGRES_HOST is not defined");
    if (!PGPORT) throw new Error("PGPORT is not defined");
    config = {
        client: "postgresql",
        connection: {
            host: POSTGRES_HOST,
            port: parseInt(PGPORT),
            database: POSTGRES_DB,
            user: POSTGRES_USER,
            password: POSTGRES_PASSWORD,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./migrations",
            extension: "ts",
            loadExtensions: [".js"],
        },
        seeds: {
            directory: "./seeds/prod",
            extension: "ts",
            loadExtensions: [".js"],
        },
    };
} else {
    config = {
        client: "postgresql",
        connection: {
            host: POSTGRES_HOST ?? "localhost",
            port: PGPORT ? parseInt(PGPORT) : 5430,
            database: POSTGRES_DB ?? "my_class",
            user: POSTGRES_USER ?? "postgres",
            password: POSTGRES_PASSWORD ?? "postgres",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./migrations",
            extension: "ts",
            loadExtensions: [".js"],
        },
        seeds: {
            directory: "./seeds/dev",
            extension: "ts",
            loadExtensions: [".js"],
        },
    };
}

export default config;
