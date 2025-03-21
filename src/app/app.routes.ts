import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BaseComponent } from './base/base.component';
export const routes: Routes = [
    {path: '', component: LoginComponent, title:'Login'},
    {path: 'Sesion/:id', component:BaseComponent, title:'Inicio'},
    
];
