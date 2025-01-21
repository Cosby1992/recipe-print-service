import { IsInt, Min, IsUrl } from "class-validator";

export class RecipeRequestDto {
  @IsUrl()
  url: string;

  @IsInt()
  @Min(1)
  targetPortions: number;
}
