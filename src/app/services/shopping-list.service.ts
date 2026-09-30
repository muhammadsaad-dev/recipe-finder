import { computed, Injectable, signal } from '@angular/core';
import { ShoppingItem } from '../models/shopping-item.type';
import { RecipeIngredient } from '../models/recipe.type';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private readonly STORAGE_KEY = 'recipe_finder_shopping_list';

  items = signal<ShoppingItem[]>(this.loadItems());

  // Count of unchecked grocery items
  pendingCount = computed(() => this.items().filter((item) => !item.completed).length);

  private loadItems(): ShoppingItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load shopping list from localStorage', e);
      return [];
    }
  }

  private saveItems(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
    } catch (e) {
      console.error('Failed to save shopping list to localStorage', e);
    }
  }

  addCustomItem(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;

    const newItem: ShoppingItem = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: trimmed,
      originalText: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    this.items.update((list) => [newItem, ...list]);
    this.saveItems();
  }

  addIngredientsFromRecipe(
    recipeTitle: string,
    recipeId: number,
    ingredients: RecipeIngredient[]
  ): number {
    if (!ingredients || ingredients.length === 0) return 0;

    const currentList = this.items();
    const newItems: ShoppingItem[] = [];

    for (const ing of ingredients) {
      // Avoid exact duplicate addition for same recipe & ingredient
      const alreadyExists = currentList.some(
        (item) => item.recipeId === recipeId && item.name.toLowerCase() === (ing.name || ing.original).toLowerCase()
      );

      if (!alreadyExists) {
        newItems.push({
          id: `rec_${recipeId}_${ing.id || Math.random().toString(36).substring(2, 7)}`,
          name: ing.name || ing.original,
          originalText: ing.original,
          amount: ing.amount,
          unit: ing.unit,
          recipeTitle,
          recipeId,
          completed: false,
          createdAt: Date.now(),
        });
      }
    }

    if (newItems.length > 0) {
      this.items.update((list) => [...newItems, ...list]);
      this.saveItems();
    }

    return newItems.length;
  }

  toggleItem(id: string): void {
    this.items.update((list) =>
      list.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
    this.saveItems();
  }

  removeItem(id: string): void {
    this.items.update((list) => list.filter((item) => item.id !== id));
    this.saveItems();
  }

  clearCompleted(): void {
    this.items.update((list) => list.filter((item) => !item.completed));
    this.saveItems();
  }

  clearAll(): void {
    this.items.set([]);
    this.saveItems();
  }
}
