import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card-component',
  templateUrl: './product-card-component.component.html',
  styleUrls: ['./product-card-component.component.scss'],
})
export class ProductCardComponentComponent   {
  @Input() product: any; 
  constructor() { }

  

}
