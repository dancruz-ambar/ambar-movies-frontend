import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

import { HomeView } from '@views/home/home.view';
import { LoginView } from '@views/login/login.view';
import { RegisterView } from '@views/register/register.view';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@views/login/login.view').then((m) => m.LoginView),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('@views/register/register.view').then((m) => m.RegisterView),
    canActivate: [guestGuard],
  },
  {
    path: 'home',
    loadComponent: () => import('@views/home/home.view').then((m) => m.HomeView),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
