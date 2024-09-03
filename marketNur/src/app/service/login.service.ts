/*import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  getHeaders() {
    throw new Error('Method not implemented.');
  }

  private url  = 'http://24.199.117.47/api/auth/loginuser';

  constructor(private http: HttpClient) { }

  login(email: string, password: string ) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    const body = {
      email,
      password
    }
    return this.http.post<Usuario>(this.url, body, {headers})
  }
}*/


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = 'http://24.199.117.47/api/auth/loginuser';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
      email,
      password
    };

    return this.http.post<any>(this.url, body, { headers });
  }

  // Método para guardar el token en local storage u otro lugar seguro
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }
}

