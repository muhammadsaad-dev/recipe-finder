import { Component, input } from '@angular/core';
import { Recipe } from '../../models/recipe.type';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css',
})
export class RecipeCard {
  recipe = input.required<Recipe>();
}
