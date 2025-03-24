import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { UsuarioComponent } from './usuario/usuario.component';
export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'usuario/:id', component: UsuarioComponent }, 
];

