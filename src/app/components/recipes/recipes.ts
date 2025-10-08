import { Component, effect, inject, input, OnInit } from '@angular/core';
import { UserInput } from '../../models/user-input.type';
import { RecipeService } from '../../services/recipe-service';
import { Recipe } from '../../models/recipe.type';
import { RecipeCard } from '../recipe-card/recipe-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipes',
  imports: [RecipeCard, CommonModule],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes {
  userInputs = input<UserInput>();
  recipeService = inject(RecipeService);

  results: Recipe[] = [];

  // 👇 effect runs whenever userInputs() changes
  fetchRecipes = effect(() => {
    const inputs = this.userInputs();
    if (inputs) {
      this.recipeService.getRecipes(inputs.query, inputs.limit).subscribe((res) => {
        this.results = res.results;
      });
    }
  });
}
