import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShoppingListService } from '../services/shopping-list.service';
import { ShoppingItem } from '../models/shopping-item.type';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './shopping-list.html',
  styleUrl: './shopping-list.css',
})
export class ShoppingList {
  shoppingService = inject(ShoppingListService);

  customItemName = signal<string>('');
  copiedNotification = signal<boolean>(false);
  filterMode = signal<'all' | 'pending' | 'completed'>('all');

  filteredItems = computed(() => {
    const items = this.shoppingService.items();
    const mode = this.filterMode();
    if (mode === 'pending') return items.filter((i) => !i.completed);
    if (mode === 'completed') return items.filter((i) => i.completed);
    return items;
  });

  completedCount = computed(
    () => this.shoppingService.items().filter((i) => i.completed).length
  );

  totalCount = computed(() => this.shoppingService.items().length);

  addCustomItem() {
    const name = this.customItemName().trim();
    if (name) {
      this.shoppingService.addCustomItem(name);
      this.customItemName.set('');
    }
  }

  toggleItem(id: string) {
    this.shoppingService.toggleItem(id);
  }

  removeItem(id: string) {
    this.shoppingService.removeItem(id);
  }

  clearCompleted() {
    this.shoppingService.clearCompleted();
  }

  clearAll() {
    if (confirm('Are you sure you want to clear your entire grocery list?')) {
      this.shoppingService.clearAll();
    }
  }

  copyToClipboard() {
    const items = this.shoppingService.items();
    if (items.length === 0) return;

    const text = items
      .map((item) => `[${item.completed ? 'x' : ' '}] ${item.originalText || item.name}`)
      .join('\n');

    navigator.clipboard.writeText(`🛒 My RecipeFinder Grocery List:\n\n${text}`).then(() => {
      this.copiedNotification.set(true);
      setTimeout(() => {
        this.copiedNotification.set(false);
      }, 2500);
    });
  }
}
