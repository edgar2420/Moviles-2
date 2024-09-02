import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'detallepokemon/:id',
    loadComponent: () => import('./pages/detallepokemon/detallepokemon.page').then((m) => m.DetallepokemonPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
