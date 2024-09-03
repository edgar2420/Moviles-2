import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  setSearchTerm(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
  }

  getSearchTerm(): BehaviorSubject<string> {
    return this.searchTermSubject;
  }

  // Modifica el método para recibir parámetros requeridos
  searchProducts(name: string, description: string, price: number) {
    const body = { name, description, price };
    return this.http.post<any[]>('http://24.199.117.47/api/products/search', body);
  }
}
