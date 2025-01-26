import { IsOptional, IsString, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class OriginDTO {
  @IsOptional()
  @IsString()
  website: string | null;

  @IsOptional()
  @IsString()
  domain: string | null;
}

export class ImageDTO {
  @IsOptional()
  @IsString()
  url: string | null;

  @IsOptional()
  @IsString()
  alt: string | null;
}

export class DetailsDTO {
  @IsOptional()
  @IsString()
  cooking_time: string | null;

  @IsOptional()
  @IsString()
  preperation_time: string | null;

  @IsOptional()
  @IsNumber()
  portion_count: number | null;

  @IsOptional()
  @IsNumber()
  calories_per_portion: number | null;
}

export class PreparationStepDTO {
  @IsOptional()
  @IsNumber()
  index: number | null;

  @IsOptional()
  @IsString()
  text: string | null;
}

export class PreparationDTO {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreparationStepDTO)
  steps: PreparationStepDTO[] | null;
}

export class IngredientDTO {
  @IsOptional()
  @IsNumber()
  amount: number | null;

  @IsOptional()
  @IsString()
  unit: string | null;

  @IsOptional()
  @IsString()
  name: string | null;
}

export class RecipeDTO {
  @IsOptional()
  @IsString()
  date: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => OriginDTO)
  origin: OriginDTO | null;

  @IsOptional()
  @IsString()
  title: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDTO)
  image: ImageDTO | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => DetailsDTO)
  details: DetailsDTO | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => PreparationDTO)
  preparation: PreparationDTO | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDTO)
  ingredients: IngredientDTO[] | null;
}
