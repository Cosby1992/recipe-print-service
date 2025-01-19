import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { HttpStatus, HttpStatusMessages } from "../constants/http-status";
import { ErrorResponse } from "../dtos/error-response.dto";

/**
 * Validation middleware to validate request body against a DTO class.
 * @param type Class to validate the incoming request body against.
 */
export function validationMiddleware<T extends object>(type: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(type, req.body); // Transform plain object into class instance
    const errors = await validate(dtoInstance, {
      whitelist: true, // Strips properties not defined in the DTO
      forbidNonWhitelisted: true, // Rejects requests with extra unexpected fields
      forbidUnknownValues: true, // Prevents unknown values from being validated
    });

    if (errors.length > 0) {
      // Extract detailed messages for all errors
      const messages = errors.flatMap((error) =>
        Object.values(error.constraints || {})
      );

      return res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpStatusMessages[HttpStatus.BAD_REQUEST],
        status: HttpStatus.BAD_REQUEST,
        errors: messages,
      } satisfies ErrorResponse);
    }

    next();
  };
}
