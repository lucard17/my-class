import { apiLogger as log } from "../logger/logger.service.js";
import { Request, Response, Router, NextFunction } from "express";
import { parseLessonsGetQueryParamsMiddleware, LessonsGetQueryParams } from "./lessons.middewares.js";
import { errorHandler, InternalServerError } from "../utils/api.utils.js";
import lessonsModel from "./lessons.model.js";

async function getLessons(req: Request<unknown, unknown, unknown, LessonsGetQueryParams>, res: Response, next: NextFunction) {
    log.debug(`GET /lessons, parsed query params:`, JSON.stringify(req.query));
    const data = await lessonsModel.getLessons(req.query);
    if (!data.error) {
        res.json(data);
    } else {
        next(new InternalServerError());
    }
}

export const lessonsRouter = Router().get(
    "/",
    [parseLessonsGetQueryParamsMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void],
    getLessons,
    [errorHandler],
);
