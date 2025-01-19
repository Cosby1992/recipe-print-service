import { HttpStatus } from "../constants/http-status";

export type ErrorResponse = {
    message: string;
    status: HttpStatus;
    errors: string[];
  };