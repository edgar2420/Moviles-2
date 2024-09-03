import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { registro } from '../models/registro';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private url  = 'http://24.199.117.47/api/auth/registeruser';

  constructor(private http: HttpClient) { }

  registro(fullname:string, email: string, password: string ) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    const body = {
      fullname,
      email,
      password
    }
    return this.http.post<registro>(this.url, body, {headers})
  }
}
