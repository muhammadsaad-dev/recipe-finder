import { Injectable, signal } from '@angular/core';
import { Recipe } from '../models/recipe.type';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  favorites = signal<Recipe[]>(this.loadFavorites());

  private loadFavorites(): Recipe[] {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load favorites from localStorage', e);
      return [];
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem('favorites', JSON.stringify(this.favorites()));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }

  addToFavorites(recipe: Recipe): void {
    if (!this.isFavorite(recipe.id)) {
      this.favorites.update((list) => [recipe, ...list]);
      this.saveFavorites();
    }
  }

  removeFromFavorites(id: number): void {
    this.favorites.update((list) => list.filter((r) => r.id !== id));
    this.saveFavorites();
  }

  isFavorite(id: number): boolean {
    return this.favorites().some((r) => r.id === id);
  }

  clearAllFavorites(): void {
    this.favorites.set([]);
    this.saveFavorites();
  }
}
