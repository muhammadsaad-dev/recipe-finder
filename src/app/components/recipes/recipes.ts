import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { UserInput } from '../../models/user-input.type';
import { RecipeService } from '../../services/recipe-service';
import { Recipe } from '../../models/recipe.type';
import { RecipeCard } from '../recipe-card/recipe-card';

@Component({
  selector: 'app-recipes',
  imports: [RecipeCard],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes implements OnInit {
  userInputs = input<UserInput>();
  private recipeService = inject(RecipeService);

  results = signal<Recipe[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  currentQuery = signal<string>('Featured & Trending Recipes');
  skeletonPlaceholders = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor() {
    // Reactively trigger search when userInputs changes
    effect(() => {
      const inputs = this.userInputs();
      if (inputs) {
        this.executeSearch(inputs);
      }
    });
  }

  ngOnInit() {
    // If no userInputs provided initially, load featured recipes
    if (!this.userInputs()) {
      this.executeSearch({
        query: 'popular',
        limit: '12',
      });
    }
  }

  private executeSearch(inputs: UserInput) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Compute descriptive section heading
    let heading = 'Featured Recipes';
    if (inputs.searchMode === 'ingredients' && inputs.ingredients && inputs.ingredients.length > 0) {
      heading = `Recipes with ${inputs.ingredients.slice(0, 3).join(', ')}${inputs.ingredients.length > 3 ? ` +${inputs.ingredients.length - 3} more` : ''}`;
    } else if (inputs.query && inputs.query !== 'popular') {
      heading = `Results for "${inputs.query}"`;
    } else if (inputs.cuisine) {
      heading = `${inputs.cuisine} Cuisine Recipes`;
    } else if (inputs.diet) {
      heading = `${inputs.diet} Recipes`;
    } else if (inputs.mealType) {
      heading = `${inputs.mealType.charAt(0).toUpperCase() + inputs.mealType.slice(1)} Recipes`;
    }

    this.currentQuery.set(heading);

    this.recipeService.searchRecipes(inputs).subscribe({
      next: (res) => {
        this.results.set(res?.results || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching recipes:', err);
        this.errorMessage.set(
          'Unable to load recipes right now. Please check your connection or try adjusting your search filters.'
        );
        this.isLoading.set(false);
      },
    });
  }
}
