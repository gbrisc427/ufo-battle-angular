import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
selector: 'app-rankings',
standalone: true,
imports: [CommonModule],
templateUrl: './rankings.html',
styleUrl: './rankings.scss',
})
export class Rankings implements OnInit {
globalRecords: any[] = [];
personalRecords: any[] = []; // Para el futuro backend
username: string | null = null;

constructor(public api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadGlobalRecords();

    if (this.api.isLoggedIn()) {
        if (typeof localStorage !== 'undefined') {
            this.username = localStorage.getItem('currentUser');
        }

        if (this.username) {
            this.loadPersonalRecords(this.username);
        } else {
            console.warn('Usuario logueado pero no encontrado en localStorage');
        }
    }
  }

  loadPersonalRecords(user: string) {
    this.api.getUserRecords(user).subscribe({
        next: (data: any) => {
            this.personalRecords = data;
            this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error conectando con scoreserver.js:', err)
    });
  }

  loadGlobalRecords() {
    this.api.getGlobalRecords().subscribe({
      next: (data) => {
        this.globalRecords = data.sort((a, b) => b.punctuation - a.punctuation).slice(0, 10);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando récords globales', err)
    });
  }
}
