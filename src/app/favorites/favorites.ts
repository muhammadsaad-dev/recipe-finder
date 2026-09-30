import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../services/favorites-service';
import { RecipeCard } from '../components/recipe-card/recipe-card';

@Component({
  standalone: true,
  selector: 'app-favorites',
  imports: [RecipeCard, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  favoritesService = inject(FavoritesService);

  clearFavorites() {
    if (confirm('Are you sure you want to remove all saved favorites?')) {
      this.favoritesService.clearAllFavorites();
    }
  }
}
