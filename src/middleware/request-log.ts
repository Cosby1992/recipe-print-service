import { Request, Response, NextFunction } from 'express';

// Middleware function to log request and response details
export const requestLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const start = process.hrtime(); // Record the start time
        const { method, originalUrl } = req;

        // Hook into the response finish event
        res.on('finish', () => {
            const [seconds, nanoseconds] = process.hrtime(start); // Calculate elapsed time
            const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
            const { statusCode } = res;

            // Log the request details
            console.log(
                `[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} - ${durationMs} ms`
            );
        });

        next(); // Proceed to the next middleware or route handler
    };

