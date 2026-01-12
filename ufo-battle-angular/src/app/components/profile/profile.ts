import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  newpassw = '';
  newpasswrepeat  = '';
  username: string | null = '' ;
  message = '';
  isError = false;


  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {

    if (this.api.isLoggedIn()) {
      if (typeof localStorage !== 'undefined') {
        this.username = localStorage.getItem('currentUser');
      }
    }
  }


  onChange() {
    if (!this.newpassw || !this.newpasswrepeat) {
      this.showMessage('Debes rellenar todos los campos', true);
      return;
    }

    if (this.newpassw != this.newpasswrepeat) {
      this.showMessage('Las contraseñas deben coincidir', true);
      return;
    }
    if (this.api.getToken() == null){
      this.showMessage('Token caducado, vuelve a iniciar sesión', true);
      return;
    }

    // En el token pongo "" porque tengo en la función getToken que puede devoolver null, y aunque lo
    // compruebe antes (si es null) me sale error.(Con username lo mismo)
    console.log(this.api.getToken())
    console.log(this.username)


    this.api.changePassword(this.newpassw, this.api.getToken() || "", this.username|| "").subscribe({
      next: (response) => {
        this.showMessage('Password cambiada con éxito', false);
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.showMessage('error', true);
      }
    });


    /* PARA EL LADO SERVIDOR

    this.api.changePasswordlocalServer(this.newpassw, this.api.getToken() || "", this.username|| "").subscribe({
      next: (response) => {
        this.showMessage('Password cambiada con éxito', false);
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.showMessage('error', true);
      }
    });

     */
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
