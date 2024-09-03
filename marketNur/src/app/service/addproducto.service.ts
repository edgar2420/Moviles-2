import { Injectable } from '@angular/core';
import { DataService } from './data-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddproductoService {

  private baseUrl = 'http://24.199.117.47/api/products';

  constructor(private dataService: DataService, private http: HttpClient) { }

  registerProduct(productData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.baseUrl, productData, { headers }).pipe(
      catchError((error) => this.handleError('Error al registrar el producto', error))
    );
  }

  uploadProductImage(productId: number, imageData: File): Observable<any> {
    const url = `${this.baseUrl}/${productId}/image`;
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('image', imageData);
    return this.http.post(url, formData, { headers }).pipe(
      catchError((error) => this.handleError('Error al subir la imagen del producto', error))
    );
  }

  private getHeaders(): HttpHeaders {
    const token = this.dataService.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  private handleError(message: string, error: any): Observable<never> {
    console.error(message, error);

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      return throwError('Something went wrong. Please try again later.');
    } else {
      // El servidor devolvió un código de error
      return throwError(error.error || 'Server error');
    }
  }
}
