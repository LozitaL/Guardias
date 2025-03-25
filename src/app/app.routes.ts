import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AuthGuard } from './auth.guard'; 

export const routes: Routes = [
  { path: '', component: LoginComponent },  
  { 
    path: 'usuario/:id', 
    component: UsuarioComponent,
    canActivate: [AuthGuard] 
  },
];


