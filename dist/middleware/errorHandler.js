"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        error: "Not Found",
        message: "The requested resource was not found",
        path: req.originalUrl,
    });
}
function errorHandler(error, req, res, next) {
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
