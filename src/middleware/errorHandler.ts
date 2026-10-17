import { Request, Response, NextFunction } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res
    .status(404)
    .json({
      success: false,
      error: "Not Found",
      message: "The requested resource was not found",
      path: req.originalUrl,
    });
}
export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) return next(error);
  const err = error as {
    status?: number;
    message?: string;
    stack?: string;
  } | null;
  const code = err?.status;
  const status =
    typeof code === "number" &&
    Number.isInteger(code) &&
    code >= 400 &&
    code <= 599
      ? code
      : 500;
  if (status >= 500) console.error(error);
  res
    .status(status)
    .json({
      success: false,
      error:
        status >= 500 ? "Internal Server Error" : err?.message || "Bad Request",
      ...(process.env.NODE_ENV !== "production" && err?.stack
        ? { stack: err.stack }
        : {}),
    });
}
