import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data-service.service';
import { LoginService } from 'src/app/service/login.service';
import { AlertController } from '@ionic/angular'; // Importa AlertController

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {

  formData = {
    username: "test@test.com",
    password: "Test!123"
  };

  constructor(
    private sLogin: LoginService,
    private router: Router,
    private dataService: DataService,
    private alertController: AlertController // Inyecta AlertController
  ) { }

  async onClick() {
    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.username)) {
      console.log('Correo electrónico no válido');
      this.showErrorMessage('Correo electrónico no válido');
      return;
    }

    // Validar la longitud de la contraseña
    if (this.formData.password.length < 6) {
      console.log('La contraseña debe tener al menos 6 caracteres');
      this.showErrorMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validar que la contraseña no contenga espacios
    if (this.formData.password.includes(' ')) {
      console.log('La contraseña no puede contener espacios');
      this.showErrorMessage('La contraseña no puede contener espacios');
      return;
    }

    // Intentar iniciar sesión
    console.log('Form Data:', this.formData);
    this.sLogin.login(this.formData.username, this.formData.password).subscribe( (data) => {
      console.log(data);
      this.dataService.setItem('token', data.access_token);
      this.router.navigate(['/home']);
    }, async (err) => { // Utiliza "async" para manejar el método de alerta
      console.log(err);

      // Mostrar mensaje de error si el usuario o la contraseña son incorrectos
      if (err.status === 401) {
        console.log('Usuario o contraseña incorrectos. Verifique los datos.');
        await this.showErrorMessage('Usuario o contraseña incorrectos. Verifique los datos.');
      }
    });
  }

  private async showErrorMessage(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
