import knex, { Knex } from "knex";
import config from "./knexfile.js";
const connection = knex(config);

export type KnexModelOptions = {
    modelName: string;
    tableName: string;
    primaryKey: string[];
    fields: string[];
};
export type KnexModelResponse<T> = (T & { error: undefined }) | { error: { message: string; stack?: string } };
export default class KnexModel {
    readonly tableName: string;
    readonly primaryKey: string[];
    readonly fields: string[];
    readonly knex: Knex;
    readonly table: Knex.QueryBuilder;
    readonly name: string;
    constructor({ tableName, primaryKey, fields, modelName }: KnexModelOptions) {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
        this.fields = fields;
        this.knex = connection;
        this.table = connection(tableName);
        this.name = modelName;
    }
    handleError(error: Error): { error: { message: string; stack?: string } } {
        const result = { error: { message: error.message, stack: error.stack } };
        const pgMessage = error.message.match(/(?:.|\n)*?(?: - )(?<error>[^-]+$)/);
        if (pgMessage?.groups?.error) {
            result.error.message = pgMessage.groups.error;
        }
        return result;
    }
}
