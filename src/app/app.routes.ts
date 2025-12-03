import { Routes } from '@angular/router';
import { HomeView } from '@views/home/home.view';
import { LoginView } from '@views/login/login.view';
import { RegisterView } from '@views/register/register.view';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeView },
  { path: 'login', component: LoginView },
  { path: 'register', component: RegisterView },
  { path: '**', redirectTo: 'login' },
];
