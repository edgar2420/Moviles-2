import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateProductoPageRoutingModule } from './create-producto-routing.module';

import { CreateProductoPage } from './create-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateProductoPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateProductoPage]
})
export class CreateProductoPageModule {}
