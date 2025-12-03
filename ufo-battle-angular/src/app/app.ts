import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,  Navbar, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ufo-battle-angular');
}
