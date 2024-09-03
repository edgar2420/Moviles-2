import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateProductoPage } from './create-producto.page';

const routes: Routes = [
  {
    path: '',
    component: CreateProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateProductoPageRoutingModule {}
