import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarteamPage } from './agregarteam.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarteamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarteamPageRoutingModule {}
