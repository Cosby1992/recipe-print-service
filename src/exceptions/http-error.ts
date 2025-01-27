import { HttpStatus, HttpStatusMessages } from "../constants/http-status";
import { ErrorResponseDto } from "../dtos/error-response.dto";

export class HttpError extends Error implements ErrorResponseDto {
  public readonly status: HttpStatus;
  public readonly errors: string[];

  constructor(
    status: HttpStatus,
    statusText: string,
    errors: string[] = ["Unknown error"]
  ) {
    super(statusText);
    this.status = status;
    this.errors = errors;
  }
}

export class InternalServerError extends HttpError {
  constructor(errors?: string[] | undefined) {
    super(
      HttpStatus.InternalServerError,
      HttpStatusMessages[HttpStatus.InternalServerError],
      errors
    );
  }
}

export class BadRequestError extends HttpError {
  constructor(errors?: string[]) {
    super(
      HttpStatus.BadRequest,
      HttpStatusMessages[HttpStatus.BadRequest],
      errors
    );
  }
}

export class NotImplementedError extends HttpError {
  constructor(errors?: string[]) {
    super(
      HttpStatus.NotImplemented,
      HttpStatusMessages[HttpStatus.NotImplemented],
      errors
    );
  }
}
