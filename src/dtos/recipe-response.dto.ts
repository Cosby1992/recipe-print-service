import { IsArray, ValidateNested } from 'class-validator';
import { RecipeDTO } from './recipe.dto';
import { Type } from 'class-transformer';

export class RecipesResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeDTO)
  recipes: RecipeDTO[];
}
