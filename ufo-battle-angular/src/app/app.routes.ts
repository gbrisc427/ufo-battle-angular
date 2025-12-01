import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Play } from './pages/play/play';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Settings } from './pages/settings/settings';
import { Rankings } from './pages/rankings/rankings';

export const routes: Routes = [
{ path: '', component: Home },
{ path: 'play', component: Play },
{ path: 'login', component: Login },
{ path: 'register', component: Register },
{ path: 'settings', component: Settings },
{ path: 'rankings', component: Rankings },
{ path: '**', redirectTo: '' }
];
