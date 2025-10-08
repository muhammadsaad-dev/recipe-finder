import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./home/home').then((m) => m.Home);
    },
  },
  {
    path: 'about',
    loadComponent: () => {
      return import('./about/about').then((m) => m.About);
    },
  },
  {
    path: 'favorites',
    loadComponent: () => {
      return import('./favorites/favorites').then((m) => m.Favorites);
    },
  },
  {
    path: 'recipe/:id',
    loadComponent: () => {
      return import('./components/recipe-details/recipe-details').then((m) => m.RecipeDetails);
    },
  },
];
