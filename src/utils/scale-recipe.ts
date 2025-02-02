import { RecipeDTO } from '../dtos/recipe.dto';

export const scaleRecipe = (recipe: RecipeDTO, targetPortions: number): RecipeDTO => {
  if (!recipe.details?.portion_count) {
    throw new Error('Failed to scale recipe, missing portion count');
  }

  if (recipe.details.portion_count === targetPortions) {
    return { ...recipe };
  }

  // Get scale factor
  const scale = targetPortions / recipe.details.portion_count;
  // clone object with new portion count
  const clone: RecipeDTO = { ...recipe, details: { ...recipe.details, portion_count: targetPortions } };

  // Scale recipe ingredients
  clone.ingredients?.forEach((ingredient) => {
    if (ingredient.amount) {
      ingredient.amount = ingredient.amount * scale;
    }
  });

  // return scaled recipe
  return clone;
};
