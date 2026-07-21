import { Request, Response, NextFunction } from "express";

export function notFoundHandler(
    req: Request,
    res: Response
) {
    res.status(404).json({
        success: false,
        error: "Not Found",
        message: "The requested resource was not found",
        path: req.originalUrl,
    });
}

export function errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(error);

    const statusCode = error.status || 500;

    res.status(statusCode).json({
        success: false,
        error: error.message || "Internal Server Error",
        ...(process.env.NODE_ENV !== "production" && {
        stack: error.stack,
        }),
    });
}