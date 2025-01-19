import { IsString, IsInt, IsOptional, Min, IsIn } from "class-validator";

export class RecipeRequestDto {
  @IsString()
  url: string; // Required, must be a valid string.

  @IsInt()
  @Min(1)
  targetPortions: number; // Required, must be an integer and greater than 0.

  @IsOptional()
  @IsIn(["metric", "imperial"])
  unitSystem?: string; // Optional, must be 'metric' or 'imperial'.

  @IsOptional()
  @IsString()
  language?: string; // Optional, must be a valid string.
}
