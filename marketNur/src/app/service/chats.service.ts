import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private apiUrl = 'http://24.199.117.47/api/chats';

  constructor(private http: HttpClient) { }

  getChatsByUser(userId: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Asegúrate de incluir cualquier header de autenticación necesario (token, etc.)
    });

    const params = {
      userId
    };

    return this.http.get<any[]>(this.apiUrl, { headers, params });
  }

  // Puedes agregar más métodos según tus necesidades, como enviar mensajes, obtener detalles del chat, etc.
}
