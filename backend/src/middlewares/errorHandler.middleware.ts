import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any, _req: Request, res: Response, _next: NextFunction) =>
{
    console.error("Error:", err.message);

    // Use status code from error object, or response status, or default to 500
    const statusCode = err.statusCode || res.statusCode || 500;
    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(statusCode).json({
        message: isDevelopment ? (err.message || "Internal Server Error") : (statusCode < 500 ? err.message : "Internal Server Error"),
        ...(
            isDevelopment
            && {
                stack: err.stack
            }
        ),
    });
};
