import { Component, computed, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserInput } from '../../models/user-input.type';

@Component({
  selector: 'app-recipe-search',
  imports: [FormsModule],
  templateUrl: './recipe-search.html',
  styleUrl: './recipe-search.css',
})
export class RecipeSearch {
  // Mode: Keyword search or Fridge/Pantry ingredient matcher
  searchMode = signal<'keyword' | 'ingredients'>('keyword');

  query = signal<string>('');
  limit = signal<string>('12');

  // Filter Drawer State
  isFilterDrawerOpen = signal<boolean>(false);

  // Advanced Filter Signals
  selectedCuisine = signal<string>('');
  selectedDiet = signal<string>('');
  selectedMealType = signal<string>('');
  selectedMaxTime = signal<number | null>(null);
  selectedSort = signal<string>('');

  // Fridge / Pantry Ingredients Signals
  ingredientInput = signal<string>('');
  ingredientsList = signal<string[]>([]);

  // Filter Data Options
  cuisines = [
    'Italian',
    'Mexican',
    'Asian',
    'Indian',
    'Mediterranean',
    'American',
    'French',
    'Japanese',
    'Greek',
    'Thai',
    'Spanish',
  ];

  diets = [
    'Vegetarian',
    'Vegan',
    'Gluten Free',
    'Ketogenic',
    'Paleo',
    'Pescetarian',
    'Low FODMAP',
  ];

  mealTypes = [
    { label: 'Main Course', value: 'main course' },
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Dessert', value: 'dessert' },
    { label: 'Appetizer', value: 'appetizer' },
    { label: 'Salad', value: 'salad' },
    { label: 'Soup', value: 'soup' },
    { label: 'Snack', value: 'snack' },
  ];

  timePresets = [
    { label: 'Any time', value: null },
    { label: '⚡ Under 15m', value: 15 },
    { label: '⏱️ Under 30m', value: 30 },
    { label: '🍲 Under 45m', value: 45 },
    { label: '⏳ Under 60m', value: 60 },
  ];

  sortOptions = [
    { label: 'Default Ranking', value: '' },
    { label: '⭐ Most Popular', value: 'popularity' },
    { label: '🥗 Healthiest First', value: 'healthiness' },
    { label: '⏱️ Fastest Prep Time', value: 'time' },
    { label: '💰 Lowest Cost', value: 'price' },
  ];

  popularTags = [
    { label: 'Pasta', emoji: '🍝' },
    { label: 'Salad', emoji: '🥗' },
    { label: 'Tacos', emoji: '🌮' },
    { label: 'Curry', emoji: '🍛' },
    { label: 'Healthy Bowl', emoji: '🥑' },
    { label: 'Dessert', emoji: '🍰' },
    { label: 'Chicken', emoji: '🍗' },
  ];

  pantryStaples = [
    'Eggs',
    'Tomatoes',
    'Cheese',
    'Garlic',
    'Chicken',
    'Onion',
    'Rice',
    'Potatoes',
    'Spinach',
    'Pasta',
  ];

  @Output() searchEvent = new EventEmitter<UserInput>();

  // Active filter count computed
  activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedCuisine()) count++;
    if (this.selectedDiet()) count++;
    if (this.selectedMealType()) count++;
    if (this.selectedMaxTime() !== null) count++;
    if (this.selectedSort()) count++;
    return count;
  });

  hasActiveFilters = computed(() => this.activeFilterCount() > 0);

  setMode(mode: 'keyword' | 'ingredients') {
    this.searchMode.set(mode);
  }

  toggleFilterDrawer() {
    this.isFilterDrawerOpen.update((open) => !open);
  }

  // Search Dispatcher
  onSearch() {
    const payload: UserInput = {
      limit: this.limit(),
      searchMode: this.searchMode(),
      cuisine: this.selectedCuisine() || undefined,
      diet: this.selectedDiet() || undefined,
      mealType: this.selectedMealType() || undefined,
      maxReadyTime: this.selectedMaxTime() ?? undefined,
      sortBy: this.selectedSort() || undefined,
    };

    if (this.searchMode() === 'ingredients') {
      if (this.ingredientsList().length === 0 && !this.query().trim()) {
        return;
      }
      payload.ingredients = this.ingredientsList();
      payload.query = this.query().trim() || undefined;
    } else {
      if (!this.query().trim() && this.activeFilterCount() === 0) {
        return;
      }
      payload.query = this.query().trim();
    }

    this.searchEvent.emit(payload);
  }

  selectTag(tagLabel: string) {
    this.query.set(tagLabel);
    this.onSearch();
  }

  // Pantry Ingredient actions
  addIngredient(name?: string) {
    const ingredient = (name || this.ingredientInput()).trim();
    if (ingredient && !this.ingredientsList().includes(ingredient)) {
      this.ingredientsList.update((list) => [...list, ingredient]);
      this.ingredientInput.set('');
    }
  }

  removeIngredient(item: string) {
    this.ingredientsList.update((list) => list.filter((i) => i !== item));
  }

  clearIngredients() {
    this.ingredientsList.set([]);
  }

  clearQuery() {
    this.query.set('');
  }

  // Filter setters
  setCuisine(cuisine: string) {
    this.selectedCuisine.set(this.selectedCuisine() === cuisine ? '' : cuisine);
  }

  setDiet(diet: string) {
    this.selectedDiet.set(this.selectedDiet() === diet ? '' : diet);
  }

  setMealType(type: string) {
    this.selectedMealType.set(this.selectedMealType() === type ? '' : type);
  }

  setMaxTime(time: number | null) {
    this.selectedMaxTime.set(this.selectedMaxTime() === time ? null : time);
  }

  setSort(sort: string) {
    this.selectedSort.set(this.selectedSort() === sort ? '' : sort);
  }

  resetAllFilters() {
    this.selectedCuisine.set('');
    this.selectedDiet.set('');
    this.selectedMealType.set('');
    this.selectedMaxTime.set(null);
    this.selectedSort.set('');
    this.onSearch();
  }
}
