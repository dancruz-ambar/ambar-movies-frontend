import { Routes } from '@angular/router';
import { HomeView } from './views/home/home.view';
import { LoginView } from './views/login/login.view';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeView },
  { path: 'login', component: LoginView },
  { path: '**', redirectTo: 'login' },
];
