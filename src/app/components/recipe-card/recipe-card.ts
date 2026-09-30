import { Component, input, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites-service';
import { Recipe } from '../../models/recipe.type';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-card.html',
  styleUrls: ['./recipe-card.css'],
})
export class RecipeCard {
  recipe = input.required<Recipe>();
  favoritesService = inject(FavoritesService);
  imageLoaded = signal(false);
  imageError = signal(false);

  toggleFavorite(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const currentRecipe = this.recipe();
    if (this.isFavorite()) {
      this.favoritesService.removeFromFavorites(currentRecipe.id);
    } else {
      this.favoritesService.addToFavorites(currentRecipe);
    }
  }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.recipe().id);
  }

  onImageLoad() {
    this.imageLoaded.set(true);
  }

  onImageError() {
    this.imageError.set(true);
    this.imageLoaded.set(true);
  }
}
