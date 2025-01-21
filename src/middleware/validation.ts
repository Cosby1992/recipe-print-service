import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpStatus, HttpStatusMessages } from "../constants/http-status";
import { ErrorResponse } from "../dtos/error-response.dto";

/**
 * Validates a class using class-validator and class-transformer
 * next() is called if validation passes, else an error response is send to client
 * @param type A class to validate containing decorators or transforms 
 * by class-validator or class-tranformer
 * @returns (RequestHandler) a middleware function
 * 
 * @example
 * router.post(
 *      "/extract-from-url",
 *      validationMiddleware(RecipeRequestDto), // returns a middleware function
 *      (req, res) => {
 *          res.send("[POST '/'] validation passed!");
 *      }
 * );
 */
export const validationMiddleware = <T extends object>(type: new () => T): RequestHandler => {
  if (!type || typeof type !== "function") {
    throw new Error("Invalid DTO class provided to validationMiddleware");
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoInstance = plainToInstance(type, req.body);

      const errors = await validate(dtoInstance, {
        whitelist: true, // Strips properties not defined in the DTO
        forbidNonWhitelisted: true, // Rejects requests with extra unexpected fields
        forbidUnknownValues: true, // Prevents unknown values from being validated
      });

      if (errors.length > 0) {
        // Extract error list
        const validationErrors: string[] = errors.flatMap((error) =>
          Object.values(error.constraints || {})
        );

        res.status(HttpStatus.BAD_REQUEST).json({
          message: HttpStatusMessages[HttpStatus.BAD_REQUEST],
          status: HttpStatus.BAD_REQUEST,
          errors: validationErrors,
        } satisfies ErrorResponse);

        return;
      }

      next();
    } catch (error) {
      console.error(error);
      if (error instanceof SyntaxError) {
        // Handle json parse error
        res.status(HttpStatus.BAD_REQUEST).json({
          message: HttpStatusMessages[HttpStatus.BAD_REQUEST],
          status: HttpStatus.BAD_REQUEST,
          errors: ["Failed to parse request body"],
        } satisfies ErrorResponse);
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: HttpStatusMessages[HttpStatus.INTERNAL_SERVER_ERROR],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [],
      } satisfies ErrorResponse);

      return;
    }
  };
};
