import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { CommonModule } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { ImageCarouselComponentComponent } from './image-carousel-component/image-carousel-component.component';
import { ProductCardComponentComponent } from './product-card-component/product-card-component.component';


@NgModule({
    declarations: [ImageCarouselComponentComponent, ProductCardComponentComponent ],
    imports: [
        IonicModule,
        CommonModule
    ],
    exports:[ImageCarouselComponentComponent, ProductCardComponentComponent],
})
export class SharedModule {}
