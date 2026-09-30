export interface ShoppingItem {
  id: string;
  name: string;
  originalText?: string;
  amount?: number;
  unit?: string;
  recipeTitle?: string;
  recipeId?: number;
  completed: boolean;
  createdAt: number;
}
