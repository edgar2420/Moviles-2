// chats.page.ts
import { Component, OnInit } from '@angular/core';
import { ChatsService } from 'src/app/service/chats.service';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  chats: any[] = [];

  constructor(private chatsService: ChatsService, private loginService: LoginService) { }

  ngOnInit() {
    // Obtener el token almacenado
    const authToken = localStorage.getItem('access_token');

    // Realizar la llamada solo si hay un token
    if (authToken) {
      const userId = 'user1';
      this.chatsService.getChatsByUser(userId)
        .subscribe(
          data => {
            this.chats = data;
          },
          error => {
            console.error('Error al obtener los chats:', error);
            // Puedes mostrar un mensaje de error al usuario o realizar otras acciones aquí.
          }
        );
    } else {
      console.error('No hay token de acceso. Usuario no autenticado.');
      // Puedes redirigir al usuario a la página de inicio de sesión u realizar otras acciones aquí.
    }
  }
}
