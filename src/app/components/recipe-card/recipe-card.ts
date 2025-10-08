import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites-service'; // adjust path

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-card.html',
  styleUrls: ['./recipe-card.css'],
})
export class RecipeCard {
  recipe = input<any>();
  favoritesService = inject(FavoritesService);

  toggleFavorite(event: Event) {
    event.stopPropagation(); // prevent link click
    const recipe = this.recipe();
    if (this.favoritesService.isFavorite(recipe.id)) {
      this.favoritesService.removeFromFavorites(recipe.id);
    } else {
      this.favoritesService.addToFavorites(recipe);
    }
  }

  isFavorite() {
    return this.favoritesService.isFavorite(this.recipe().id);
  }
}
