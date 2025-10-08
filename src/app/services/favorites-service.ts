import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  favorites = signal<any[]>(this.loadFavorites());

  private loadFavorites() {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  }

  private saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites()));
  }

  addToFavorites(recipe: any) {
    if (!this.isFavorite(recipe.id)) {
      this.favorites.update((list) => [...list, recipe]);
      this.saveFavorites();
    }
  }

  removeFromFavorites(id: number) {
    this.favorites.update((list) => list.filter((r) => r.id !== id));
    this.saveFavorites();
  }

  isFavorite(id: number): boolean {
    return this.favorites().some((r) => r.id === id);
  }
}
