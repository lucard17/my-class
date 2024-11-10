import { Request, Response, NextFunction } from "express";
export class ApiError extends Error {
    details?: string[];
    status: number;
    constructor(message: string, status: number, details?: string[]) {
        super(message);
        this.status = status;
        this.name = "BadRequestError";
        if (details) {
            this.details = details;
        }
    }
}
export class BadRequestError extends ApiError {
    constructor(message: string, details?: string[]) {
        super(message, 400, details);
        this.name = "BadRequestError";
    }
}
export class InternalServerError extends ApiError {
    constructor() {
        super("Internal Server Error", 500, undefined);
        this.name = "InternalServerError";
    }
}
export function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
    res.status(err.status || 500);
    res.json({ message: err.message, details: err.details });
}
