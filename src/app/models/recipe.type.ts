export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  aggregateLikes?: number;
  healthScore?: number;
  spoonacularScore?: number;
  pricePerServing?: number;
  cheap?: boolean;
  dairyFree?: boolean;
  glutenFree?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  veryHealthy?: boolean;
  veryPopular?: boolean;
  sustainable?: boolean;
  weightWatcherSmartPoints?: number;
  gaps?: string;
  lowFodmap?: boolean;
  cuisines?: string[];
  dishTypes?: string[];
  diets?: string[];
  occasions?: string[];
  summary?: string;
  instructions?: string;
  extendedIngredients?: RecipeIngredient[];
  analyzedInstructions?: AnalyzedInstruction[];
}

export interface RecipeIngredient {
  id: number;
  aisle?: string;
  image?: string;
  name: string;
  nameClean?: string;
  original: string;
  originalName?: string;
  amount: number;
  unit: string;
  measures?: {
    us: { amount: number; unitLong: string; unitShort: string };
    metric: { amount: number; unitLong: string; unitShort: string };
  };
}

export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

export interface InstructionStep {
  number: number;
  step: string;
  ingredients?: { id: number; name: string; image: string }[];
  equipment?: { id: number; name: string; image: string }[];
  length?: { number: number; unit: string };
}
