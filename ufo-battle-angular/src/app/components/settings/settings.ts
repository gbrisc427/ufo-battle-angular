import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
selector: 'app-settings',
standalone: true,
imports: [FormsModule, CommonModule],
templateUrl: './settings.html',
styleUrl: './settings.scss',
})
export class Settings {
// Valores por defecto
nUfos = '1';
time = '60';
doubleSpeed = false;

message = '';

constructor(private router: Router, private cdr: ChangeDetectorRef) {
    // Cargar preferencias actuales al iniciar
    if (typeof localStorage !== 'undefined') {
      this.nUfos = localStorage.getItem('ufo_num') || '1';
      this.time = localStorage.getItem('gameTime') || '60';
      this.doubleSpeed = localStorage.getItem('doubleSpeedK') === 'true';
    }
  }

  savePreferences() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ufo_num', this.nUfos);
      localStorage.setItem('gameTime', this.time);
      // Guardamos como string 'true'/'false' para ser consistentes con tu lógica anterior
      localStorage.setItem('doubleSpeedK', String(this.doubleSpeed));

      this.showMessage();
    }
  }

  showMessage() {
    this.message = 'AJUSTES GUARDADOS CORRECTAMENTE';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.message = '';
      this.cdr.detectChanges();
      // Opcional: Redirigir al juego o home tras guardar
      // this.router.navigate(['/play']);
    }, 1500);
  }
}
