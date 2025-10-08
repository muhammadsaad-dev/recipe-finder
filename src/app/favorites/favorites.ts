import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../services/favorites-service';
import { RecipeCard } from '../components/recipe-card/recipe-card';

@Component({
  standalone: true,
  selector: 'app-favorites',
  imports: [CommonModule, RecipeCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  favoritesService = inject(FavoritesService);
}
