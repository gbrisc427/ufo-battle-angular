import { Component } from '@angular/core';
import { RouterLink , Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(public api: ApiService, private router: Router) {}

    logout() {
      this.api.logout(); // Borra token y actualiza señal
      this.router.navigate(['/']); // Redirige a Home
    }
}
