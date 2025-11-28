import { Routes } from '@angular/router';
import { HomeView } from './views/home/home.view';

export const routes: Routes = [
  { path: '', component: HomeView },
  { path: '**', redirectTo: '' },
];
