import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  BadRequestError,
  HttpError,
  InternalServerError,
} from "../exceptions/http-error";
import { expressAsyncHandler } from "../utils/express-async-handler";

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
export const validationMiddleware = <T extends object>(
  type: new () => T
): RequestHandler => {
  return expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
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

        throw new BadRequestError(validationErrors);
      }

      next();
    }
  );
};
