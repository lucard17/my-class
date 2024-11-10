//@ts-check
import { offsetDate } from "../utils/date.utils.js";
import log4js from "log4js";

const categories = {
    default: { appenders: ["console"], level: process.env.DEFAULT_LOGS || "debug" },
    api: { appenders: ["console"], level: process.env.API_LOGS || "debug" },
    knex: { appenders: ["console"], level: process.env.KNEX_LOGS || "debug" },
};

const maxCategoryNameLen = Object.keys(categories).reduce((max, category) => Math.max(max, category.length), 0);
log4js.configure({
    appenders: {
        console: {
            type: "console",
            layout: {
                type: "pattern",
                pattern: "%[[%x{myTime}] %x{myLogLevel} %x{myCategory} -%] %m",
                tokens: {
                    myTime: function (logEvent) {
                        return offsetDate(logEvent.startTime, { hours: 3 }).toISOString().substring(0, 23);
                    },
                    myLogLevel: function (logEvent) {
                        return `[${logEvent.level.levelStr}]`.padStart(7, " ");
                    },
                    myCategory: function (logEvent) {
                        return logEvent.categoryName.padStart(maxCategoryNameLen, " ");
                    },
                },
            },
        },
    },
    categories,
});

export const defaultLogger = log4js.getLogger("default");
export const apiLogger = log4js.getLogger("api");
export const knexLogger = log4js.getLogger("knex");
