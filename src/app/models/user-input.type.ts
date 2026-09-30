export interface UserInput {
  query?: string;
  limit?: string;
  searchMode?: 'keyword' | 'ingredients';
  ingredients?: string[];
  cuisine?: string;
  diet?: string;
  mealType?: string;
  maxReadyTime?: number | null;
  sortBy?: string;
}

export interface FilterOptions {
  cuisines: { label: string; value: string }[];
  diets: { label: string; value: string }[];
  mealTypes: { label: string; value: string }[];
  timePresets: { label: string; value: number | null }[];
  sortOptions: { label: string; value: string }[];
}
