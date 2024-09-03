import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductImage } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class DetailService {
  private apiUrl = 'http://24.199.117.47/api/products';

  constructor(private http: HttpClient) {}

  getProductDetails(productId: number): Observable<Product> {
    const url = `${this.apiUrl}/${productId}`;
    return this.http.get<Product>(url);
  }

  // Método para obtener detalles específicos del producto
  getProductDetailsInfo(productId: number): Observable<any> {
    return new Observable((observer) => {
      this.getProductDetails(productId).subscribe(
        (product: Product) => {
          // Obtén los detalles del producto
          const detallesProducto = {
            titulo: product.name,
            descripcion: product.description,
            precio: product.price,
            estado: product.status,
            imagenes: product.productimages.map((imagen: ProductImage) => imagen.url),
            categoria: product.category.name,
          };

          // Pasa los detalles a quien esté escuchando la observación
          observer.next(detallesProducto);
          observer.complete();
        },
        (error) => {
          // Manejar errores aquí si es necesario
          observer.error(error);
        }
      );
    });
  }
}
