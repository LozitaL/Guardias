import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './interfaces/user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/login';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

private apiUrldatos = 'http://localhost:4000/api/datos'

  private currentDataUser:BehaviorSubject<any>;
  public DataUser: Observable<any>;



  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    let storedUser = null;
    let datosUser = null;
  
    if (isPlatformBrowser(this.platformId)) {
      storedUser = localStorage.getItem('currentUser');
      datosUser = localStorage.getItem('DataUser');
    }
      this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  
    this.currentDataUser = new BehaviorSubject<any>(
      datosUser ? JSON.parse(datosUser) : null
    );
    this.DataUser = this.currentDataUser.asObservable();
  }
  

  
  datos(id: string): Promise<any> {
    return fetch(`${this.apiUrldatos}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data: User) => {  
        if (data) {
          localStorage.setItem('DataUser', JSON.stringify(data));
          this.currentDataUser.next(data); 
        }
        return data;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  
  async inrtDatos(nombre: string, apellidos: string, curso: string, foto: string, horario:JSON){
     
      const response = await fetch(`${this.apiUrldatos}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellidos, curso, foto, horario }),
      });
    
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
    
      return response.json();
  }

  async updateDatos(id: Number, nombre?: string, apellidos?: string, curso?: string, foto?: string, horario?: JSON) {
    const updateData: any = {};

    if (nombre) updateData.nombre = nombre;
    if (apellidos) updateData.apellidos = apellidos;
    if (curso) updateData.curso = curso;
    if (foto) updateData.foto = foto;
    if (horario) updateData.horario = horario;

    const response = await fetch(`${this.apiUrldatos}/${id}/ac`, {
        method: 'PATCH',  
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),  
    });

    if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    return response.json();
}


login(username: string, password: string): Promise<any> {
  return fetch(this.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.token && isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currentUser', JSON.stringify(data));
        this.currentUserSubject.next(data);

        this.datos(data.id_profesor).then(() => {
          this.router.navigate([`/usuario/${data.id_profesor}`]);
        }).catch((error) => {
          console.error('Error al cargar los datos del usuario:', error);
        });
      }
      return data;
    })
    .catch((error) => {
      console.log('Error de autenticación:', error);
      return Promise.reject(error);
    });
}
  

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['']);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getCurrentDataUser(): Observable<User | null> {
    return this.currentDataUser.asObservable();
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
