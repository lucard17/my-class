import { apiLogger as log } from "../logger/logger.service.js";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/api.utils.js";
import { z, string } from "zod";

const dateOrInterval = z.custom<string>((arg: string) => {
    string({
        required_error: "date is required",
        invalid_type_error: "date must be defined once",
    })
        .regex(/^\d{4}-\d{2}-\d{2}(,\d{4}-\d{2}-\d{2})?$/, { message: "date must have format YYYY-MM-DD or YYYY-MM-DD,YYYY-MM-DD" })
        .parse(arg);
    const dates = arg.split(",");
    for (const d of dates) {
        string().date(`date '${d}' is invalid`).parse(d);
    }
    return true;
}, "date is required");

const teacherIds = z
    .string({ required_error: "teacherIds is required", invalid_type_error: "teacherIds must be defined once" })
    .regex(/^[1-9]\d*(,[1-9]\d*)*$/, { message: "teacherIds must be comma-separated list of integers" });

const lessonStatus = z
    .string({
        required_error: "status is required",
        invalid_type_error: "status must be defined once",
    })
    .regex(/^(0|1)$/, { message: "status must be 0 or 1" });

const studentsCounts = z
    .string({ required_error: "studentsCounts is required", invalid_type_error: "studentsCounts must be defined once" })
    .regex(/^[1-9]\d*(,[1-9]\d*)?$/, { message: "studentsCount must be number or comma-separated range" });

const pageNumber = z
    .string({ required_error: "page is required", invalid_type_error: "page must be defined once" })
    .regex(/^[1-9]\d*$/, { message: "page must be number and greater than 0" });

const lessonsPerPage = z
    .string({ required_error: "lessonsPerPage is required", invalid_type_error: "lessonsPerPage must be defined once" })
    .regex(/^[1-9]\d*$/, { message: "lessonsPerPage must be number and greater than 0" });

const queryParamsSchema = z
    .object({
        date: dateOrInterval.transform((param) => {
            const dates = param.split(",");
            if (dates.length === 2 && dates[0] === dates[1]) return [dates[0]];
            if (dates.length === 2 && dates[0] > dates[1]) return [dates[1], dates[0]];
            return dates;
        }),
        status: lessonStatus.transform((param) => parseInt(param)),
        teacherIds: teacherIds.transform((param) => param.split(",").map((value) => parseInt(value))),
        studentsCount: studentsCounts.transform((param) => param.split(",").map((value) => parseInt(value))),
        page: pageNumber.transform((value) => parseInt(value)),
        lessonsPerPage: lessonsPerPage.default("5").transform((value) => parseInt(value)),
    })
    .partial({
        date: true,
        status: true,
        teacherIds: true,
        studentsCount: true,
        page: true,
    });

export type LessonsGetQueryParams = z.infer<typeof queryParamsSchema>;

export function parseLessonsGetQueryParamsMiddleware(
    req: Request<unknown, unknown, unknown, z.infer<typeof queryParamsSchema>>,
    res: Response,
    next: NextFunction,
) {
    try {
        log.debug(`GET /lessons, native query params:`, JSON.stringify(req.query));
        req.query = queryParamsSchema.parse(req.query);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            log.debug(JSON.stringify(error.issues));
            next(
                new BadRequestError(
                    "invalid query params",
                    error.issues.map((issue) => issue.message),
                ),
            );
        }
    }
}
