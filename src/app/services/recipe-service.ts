import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RecipeSearchResponse } from '../models/recipe-search-response.type';
import { Recipe } from '../models/recipe.type';
import { UserInput } from '../models/user-input.type';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiKey = environment.spoonacular.apiKey;
  private baseUrl = environment.spoonacular.baseUrl;
  private http = inject(HttpClient);

  searchRecipes(params: UserInput): Observable<RecipeSearchResponse> {
    let httpParams = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('addRecipeInformation', 'true')
      .set('number', params.limit || '12');

    if (params.searchMode === 'ingredients' && params.ingredients && params.ingredients.length > 0) {
      httpParams = httpParams.set('includeIngredients', params.ingredients.join(','));
      if (params.query?.trim()) {
        httpParams = httpParams.set('query', params.query.trim());
      }
    } else if (params.query?.trim()) {
      httpParams = httpParams.set('query', params.query.trim());
    }

    if (params.cuisine) {
      httpParams = httpParams.set('cuisine', params.cuisine);
    }
    if (params.diet) {
      httpParams = httpParams.set('diet', params.diet);
    }
    if (params.mealType) {
      httpParams = httpParams.set('type', params.mealType);
    }
    if (params.maxReadyTime && params.maxReadyTime > 0) {
      httpParams = httpParams.set('maxReadyTime', params.maxReadyTime.toString());
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sort', params.sortBy);
    }

    const url = `${this.baseUrl}/recipes/complexSearch`;
    return this.http.get<RecipeSearchResponse>(url, { params: httpParams });
  }

  getRecipes(query: string, limit: string): Observable<RecipeSearchResponse> {
    return this.searchRecipes({ query, limit });
  }

  getRecipeById(id: string | number): Observable<Recipe> {
    const url = `${this.baseUrl}/recipes/${id}/information?apiKey=${this.apiKey}`;
    return this.http.get<Recipe>(url);
  }
}
