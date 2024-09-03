import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class PrincipalService {
  private apiUrl = 'http://24.199.117.47/api/products/search';

  constructor(private http: HttpClient) {}

  getProducts(latitude: string, longitude: string, radiusKm: string): Observable<Product[]> {
    // Asegúrate de proporcionar valores válidos para latitude, longitude y radius_km
    const requestBody = 
      {
        "latitude": "-17.768940",
        "longitude": "-63.183483",
        "radius_km": 1.6
        }
        return this.http.post<Product[]>(this.apiUrl, requestBody);
  }
}
