import { apiLogger as log } from "../logger/logger.service.js";
import { Request, Response, Router, NextFunction, RequestHandler } from "express";
import { parseLessonsGetQueryParamsMiddleware, LessonsGetQueryParams } from "./lessons.middewares.js";
import { errorHandler, InternalServerError } from "../utils/api.utils.js";
import lessonsModel from "./lessons.model.js";

async function getLessons(req: Request<unknown, unknown, unknown, LessonsGetQueryParams>, res: Response, next: NextFunction) {
    log.debug(`GET /lessons, parsed query params:`, JSON.stringify(req.query));
    const data = await lessonsModel.getLessonsV1(req.query);
    if (!data.error) {
        res.json(data);
    } else {
        next(new InternalServerError());
    }
}

export const lessonsRouter = Router();
lessonsRouter.get("/", [parseLessonsGetQueryParamsMiddleware as any], getLessons, [errorHandler]);

// * **page**. Номер возвращаемой страницы. первая страница \- 1\.
// * **lessonsPerPage**. Количество занятий на странице. По-умолчанию \- 5 занятий.
