import { Component } from '@angular/core';
import { RecipeSearch } from '../components/recipe-search/recipe-search';
import { UserInput } from '../models/user-input.type';
import { Recipes } from '../components/recipes/recipes';

@Component({
  selector: 'app-home',
  imports: [RecipeSearch, Recipes],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  userInputs?: UserInput;

  handleSearch(params: UserInput) {
    this.userInputs = params;
    console.log('Parent Receives: ', params);
  }
}
