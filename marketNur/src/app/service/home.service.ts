/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data-service.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private url = 'http://24.199.117.47/api/products';

  constructor(private dataService: DataService, private http: HttpClient) { }

  getall(): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.http.get<Product[]>(this.url, { headers });
  }

  private getHeaders(): HttpHeaders {
    const token = this.dataService.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }
}*/



import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from './data-service.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private url = 'http://24.199.117.47/api/products';

  constructor(private dataService: DataService, private http: HttpClient) { }

  getall(): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.http.get<Product[]>(this.url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getProductDetail(productId: number): Observable<Product> {
    const headers = this.getHeaders();
    const productDetailUrl = `${this.url}/${productId}`;
    return this.http.get<Product>(productDetailUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  editarProducto(productoId: number, producto: Product): Observable<any> {
    const headers = this.getHeaders();
    const editarProductoUrl = `${this.url}/${productoId}`;
    return this.http.put(editarProductoUrl, producto, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  eliminarProducto(productoId: number): Observable<any> {
    const headers = this.getHeaders();
    const eliminarProductoUrl = `${this.url}/${productoId}`;
    return this.http.delete(eliminarProductoUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  private getHeaders(): HttpHeaders {
    const token = this.dataService.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Error del lado del cliente:', error.error.message);
    } else {
      // El servidor devolvió un código de respuesta no exitoso
      console.error(`Código de error del servidor: ${error.status}, ` + `cuerpo: ${error.error}`);
    }
    // Devuelve un observable con un mensaje de error orientado al usuario
    return throwError('Something bad happened; please try again later.');
  }
}
