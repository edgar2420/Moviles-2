import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'team',
    loadChildren: () => import('./pages/team/team.module').then( m => m.TeamPageModule)
  },
  {
    path: 'pokemon',
    loadChildren: () => import('./pages/pokemon/pokemon.module').then( m => m.PokemonPageModule)
  },
  {
    path: 'agregarteam/:id',
    loadChildren: () => import('./pages/agregarteam/agregarteam.module').then( m => m.AgregarteamPageModule)
  },
  {
    path: '',
    redirectTo: 'home',           
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
