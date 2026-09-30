import { Recipe } from './recipe.type';
export type RecipeSearchResponse = {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
};
