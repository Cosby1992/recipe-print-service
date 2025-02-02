import { IsInt, Min, IsUrl, IsOptional } from 'class-validator';

export class RecipeRequestDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  targetPortions: number;
}
