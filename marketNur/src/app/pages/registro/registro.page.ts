import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroService } from 'src/app/service/registro.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  formData = {
    fullname: '',
    password: '',
    email: '',
  };

  constructor(
    private sRegistro: RegistroService, 
    private router: Router) {}

  onClick() {
    // Validaciones
    if (this.formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!/[A-Z]/.test(this.formData.password)) {
      alert('La contraseña debe contener al menos una mayúscula.');
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.formData.password)) {
      alert('La contraseña debe contener al menos un símbolo especial.');
      return;
    }

    if (/\s/.test(this.formData.password)) {
      alert('La contraseña no debe contener espacios.');
      return;
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      alert('Ingrese un correo electrónico válido.');
      return;
    }

    // Llamada al servicio de registro si todas las validaciones son exitosas
    console.log('Form Data:', this.formData);
    this.sRegistro
      .registro(
        this.formData.fullname,
        this.formData.email,
        this.formData.password
      )
      .subscribe(
        (data) => {
          console.log(data);
          alert('Usuario creado exitosamente.');
          this.router.navigate(['/login']);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
