import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RecipeSearchResponse } from '../models/recipe-search-response.type';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiKey = environment.spoonacular.apiKey;
  private baseUrl = environment.spoonacular.baseUrl;

  http = inject(HttpClient);
  getRecipes(query: string, limit: string) {
    const url = `${this.baseUrl}/recipes/complexSearch?query=${query}&number=${limit}&apiKey=${this.apiKey}`;
    return this.http.get<RecipeSearchResponse>(url);
  }

  getRecipeById(id: string) {
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${this.apiKey}`;
    return this.http.get(url);
  }
}
