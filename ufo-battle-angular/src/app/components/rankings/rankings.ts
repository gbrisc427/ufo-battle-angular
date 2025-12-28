import { Component, OnInit } from '@angular/core';
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

constructor(public api: ApiService) {}

  ngOnInit() {
    this.loadGlobalRecords();

    // Si estuviéramos logueados y tuviéramos el backend listo:
    // if (this.api.isLoggedIn()) {
    //    this.loadPersonalRecords();
    // }
  }

  loadGlobalRecords() {
    this.api.getGlobalRecords().subscribe({
      next: (data) => {
        this.globalRecords = data.sort((a, b) => b.punctuation - a.punctuation).slice(0, 10);
      },
      error: (err) => console.error('Error cargando récords globales', err)
    });
  }
}
