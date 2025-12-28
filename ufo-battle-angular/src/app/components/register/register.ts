import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
selector: 'app-register',
standalone: true,
imports: [FormsModule, CommonModule],
templateUrl: './register.html',
styleUrl: './register.scss',
})
export class Register {
username = '';
email = '';
password = '';
confirmPassword = '';

message = '';
isError = false;

constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  checkUserAvailability() {
    if (!this.username) return;

    // GET /users/{username}
    this.api.checkUser(this.username).subscribe({
      next: () => {
        this.showMessage('El nombre de usuario ya está en uso', true);
      },
      error: (err) => {
        if (err.status === 404) {
          console.log('Usuario disponible');
        }
      }
    });
  }

  onRegister() {
    if (!this.username || !this.email || !this.password) {
      this.showMessage('Todos los campos son obligatorios', true);
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showMessage('Las contraseñas no coinciden', true);
      return;
    }

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    // POST /users
    this.api.register(userData).subscribe({
      next: () => {
        this.showMessage('Usuario registrado correctamente', false);
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error al registrar usuario (quizás el email ya existe)', true);
      }
    });
  }

  showMessage(msg: string, error: boolean) {
    this.message = msg;
    this.isError = error;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.message = '';
      this.cdr.detectChanges();
    }, 3000);
  }
}
