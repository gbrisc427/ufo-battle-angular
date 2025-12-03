import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Play } from './components/play/play';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Settings } from './components/settings/settings';
import { Rankings } from './components/rankings/rankings';

export const routes: Routes = [
{ path: '', component: Home },
{ path: 'play', component: Play },
{ path: 'login', component: Login },
{ path: 'register', component: Register },
{ path: 'settings', component: Settings },
{ path: 'rankings', component: Rankings },
{ path: '**', redirectTo: '' }
];
