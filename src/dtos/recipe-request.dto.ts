import { IsString, IsInt, IsOptional, Min, IsIn } from "class-validator";

export class RecipeRequestDto {
  @IsString()
  url: string; // Required, must be a valid string.

  @IsInt()
  @Min(1)
  targetPortions: number; // Required, must be an integer and greater than 0.
}
