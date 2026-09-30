import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe-service';
import { FavoritesService } from '../../services/favorites-service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { InstructionStep, Recipe } from '../../models/recipe.type';

@Component({
  selector: 'app-recipe-details',
  imports: [RouterLink],
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.css',
})
export class RecipeDetails implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  favoritesService = inject(FavoritesService);
  shoppingService = inject(ShoppingListService);

  recipe = signal<Recipe | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  // Servings Scaler State
  originalServings = signal<number>(4);
  servings = signal<number>(4);

  // Ingredient Checklist State
  checkedIngredients = signal<Set<number>>(new Set<number>());

  // Toast feedback for shopping list
  shoppingToast = signal<string | null>(null);

  // Full-Screen Cook Mode State
  isCookModeOpen = signal<boolean>(false);
  activeStepIndex = signal<number>(0);

  // Kitchen Timer State
  timerSeconds = signal<number>(0);
  timerRunning = signal<boolean>(false);
  timerAlert = signal<boolean>(false);
  private timerInterval: any = null;

  // Computed instruction steps array
  steps = computed<InstructionStep[]>(() => {
    const rec = this.recipe();
    if (!rec) return [];
    if (rec.analyzedInstructions && rec.analyzedInstructions.length > 0) {
      return rec.analyzedInstructions[0].steps || [];
    }
    return [];
  });

  currentStep = computed<InstructionStep | null>(() => {
    const allSteps = this.steps();
    const index = this.activeStepIndex();
    return allSteps.length > 0 && index < allSteps.length ? allSteps[index] : null;
  });

  formattedTimer = computed(() => {
    const total = this.timerSeconds();
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchRecipeDetails(id);
    } else {
      this.errorMessage.set('Invalid recipe ID provided.');
      this.isLoading.set(false);
    }
  }

  ngOnDestroy() {
    this.stopTimerInterval();
  }

  fetchRecipeDetails(id: string) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.recipeService.getRecipeById(id).subscribe({
      next: (data) => {
        this.recipe.set(data);
        const baseServings = data.servings || 4;
        this.originalServings.set(baseServings);
        this.servings.set(baseServings);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching recipe details:', err);
        this.errorMessage.set('Failed to load recipe details. Please check your connection.');
        this.isLoading.set(false);
      },
    });
  }

  // Favorite toggle
  toggleFavorite() {
    const current = this.recipe();
    if (!current) return;
    if (this.isFavorite()) {
      this.favoritesService.removeFromFavorites(current.id);
    } else {
      this.favoritesService.addToFavorites(current);
    }
  }

  isFavorite(): boolean {
    const current = this.recipe();
    return current ? this.favoritesService.isFavorite(current.id) : false;
  }

  // Servings Scaler
  increaseServings() {
    this.servings.update((s) => Math.min(s + 1, 24));
  }

  decreaseServings() {
    this.servings.update((s) => Math.max(s - 1, 1));
  }

  getScaledAmount(amount?: number): string {
    if (!amount) return '';
    const ratio = this.servings() / (this.originalServings() || 1);
    const scaled = amount * ratio;

    // Format clean fraction or 2 decimal precision
    if (Math.abs(scaled - Math.round(scaled)) < 0.05) {
      return Math.round(scaled).toString();
    }
    return Number(scaled.toFixed(2)).toString();
  }

  // Ingredient checklist
  toggleIngredient(index: number) {
    const updated = new Set(this.checkedIngredients());
    if (updated.has(index)) {
      updated.delete(index);
    } else {
      updated.add(index);
    }
    this.checkedIngredients.set(updated);
  }

  isIngredientChecked(index: number): boolean {
    return this.checkedIngredients().has(index);
  }

  // Shopping List Export
  addAllToShoppingList() {
    const rec = this.recipe();
    if (!rec || !rec.extendedIngredients || rec.extendedIngredients.length === 0) return;

    const count = this.shoppingService.addIngredientsFromRecipe(
      rec.title,
      rec.id,
      rec.extendedIngredients
    );

    this.shoppingToast.set(
      count > 0
        ? `🛒 Added ${count} ingredients to your Grocery List!`
        : `All ingredients are already in your Grocery List!`
    );

    setTimeout(() => {
      this.shoppingToast.set(null);
    }, 3500);
  }

  // Cook Mode Operations
  openCookMode() {
    this.activeStepIndex.set(0);
    this.isCookModeOpen.set(true);
  }

  closeCookMode() {
    this.isCookModeOpen.set(false);
  }

  nextCookStep() {
    if (this.activeStepIndex() < this.steps().length - 1) {
      this.activeStepIndex.update((i) => i + 1);
    }
  }

  prevCookStep() {
    if (this.activeStepIndex() > 0) {
      this.activeStepIndex.update((i) => i - 1);
    }
  }

  setCookStep(index: number) {
    this.activeStepIndex.set(index);
  }

  // Kitchen Timer Operations
  setTimerMinutes(mins: number) {
    this.stopTimerInterval();
    this.timerSeconds.set(mins * 60);
    this.timerAlert.set(false);
    this.startTimer();
  }

  startTimer() {
    if (this.timerSeconds() <= 0) return;
    this.timerRunning.set(true);
    this.timerAlert.set(false);
    this.stopTimerInterval();

    this.timerInterval = setInterval(() => {
      if (this.timerSeconds() > 1) {
        this.timerSeconds.update((s) => s - 1);
      } else {
        this.timerSeconds.set(0);
        this.timerRunning.set(false);
        this.timerAlert.set(true);
        this.stopTimerInterval();
      }
    }, 1000);
  }

  pauseTimer() {
    this.timerRunning.set(false);
    this.stopTimerInterval();
  }

  resetTimer() {
    this.pauseTimer();
    this.timerSeconds.set(0);
    this.timerAlert.set(false);
  }

  private stopTimerInterval() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}
