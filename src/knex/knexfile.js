const POSTGRES_DB = process.env.POSTGRES_DB;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const PGPORT = parseInt(process.env.PGPORT || "5432");

const connection = {
    host: POSTGRES_HOST,
    port: PGPORT,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
};

/**@type {import("knex").Knex.Config} */
const config = {
    client: "postgresql",
    connection,
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
};

export default config;
