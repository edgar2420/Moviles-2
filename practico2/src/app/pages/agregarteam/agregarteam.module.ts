import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarteamPageRoutingModule } from './agregarteam-routing.module';

import { AgregarteamPage } from './agregarteam.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarteamPageRoutingModule
  ],
  declarations: [AgregarteamPage]
})
export class AgregarteamPageModule {}
