import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { DirectoryComponent } from './components/directory/directory';
import { RegisterComponent } from './components/register/register';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'LocalConnect - namma ஊர் சேவைகள்' },
  { path: 'services', component: DirectoryComponent, title: 'Village Service Directory - LocalConnect' },
  { path: 'register', component: RegisterComponent, title: 'Join as Provider - LocalConnect' },
  { path: 'admin', component: AdminComponent, title: 'Admin Verification Portal - LocalConnect' },
  { path: '**', redirectTo: '' }
];

