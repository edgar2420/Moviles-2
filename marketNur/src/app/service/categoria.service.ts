import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { categoria } from '../models/categoria'; // Asegúrate de importar el modelo de categoría

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private apiUrl = 'http://24.199.117.47/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<string[]> {
    return this.http.get<categoria[]>(this.apiUrl).pipe(
      map((categories: any[]) => categories.map(category => category.name))
    );
  }
}
