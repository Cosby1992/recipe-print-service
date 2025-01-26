import { Request, Response, NextFunction } from "express";
import { HttpError } from "../exceptions/http-error";
import { HttpStatusMessages, HttpStatus } from "../constants/http-status";
import { ErrorResponseDto } from "../dtos/error-response.dto";

export const globalErrorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global Error Handler:", err);

  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    } satisfies ErrorResponseDto);
    return;
  }

  // Fallback for unexpected errors
  res.status(HttpStatus.InternalServerError).json({
    status: HttpStatus.InternalServerError,
    message: HttpStatusMessages[HttpStatus.InternalServerError],
    errors: [err.message || "An unexpected error occurred."],
  });
};
