import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserInput } from '../../models/user-input.type';

@Component({
  selector: 'app-recipe-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-search.html',
  styleUrl: './recipe-search.css',
})
export class RecipeSearch {
  query = '';
  limit = '';

  @Output() searchEvent = new EventEmitter<UserInput>();

  onSearch() {
    this.searchEvent.emit({ query: this.query, limit: this.limit });
  }
}
