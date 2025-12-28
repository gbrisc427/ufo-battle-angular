import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';
  message = '';
  isError = false;

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.showMessage('Debes rellenar todos los campos', true);
      return;
    }

    this.api.login(this.username, this.password).subscribe({
      next: (response) => {
        const token = response.headers.get('Authorization');

        if (token) {
          this.api.setToken(token);
          this.showMessage('Sesión iniciada con éxito', false);
          setTimeout(() => this.router.navigate(['/']), 1500);
        } else {
          this.showMessage('Error: No se recibió token del servidor', true);
        }
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Usuario o contraseña incorrectos', true);
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
