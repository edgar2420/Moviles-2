import { Component, Input } from '@angular/core';
import { ProductImage } from 'src/app/models/product';

@Component({
  selector: 'app-image-carousel-component',
  templateUrl: './image-carousel-component.component.html',
  styleUrls: ['./image-carousel-component.component.scss'],
})
export class ImageCarouselComponentComponent   {
  url = "http://24.199.117.47"; 
  @Input() images: ProductImage[] = [];
  constructor() { }
}
