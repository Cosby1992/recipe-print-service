import { HttpStatus } from "../constants/http-status";

export class ErrorResponseDto {
  message: string;
  status: HttpStatus;
  errors: string[];
};
