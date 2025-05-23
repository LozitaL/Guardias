import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './interfaces/user.model';
import { Horario } from './interfaces/horario.model';

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

  private apiUrlGuardias = 'http://localhost:4000/api/notis'
  
  //Cnstr Guarda los datos 
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router,) {
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
  };

  //(Get)*Datos(id) Profesores"
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
  //Get()*Horarios Profesores" 
  async getHorariosProfesores(): Promise<any[]> {
    const response = await fetch(`${this.apiUrldatos}/horarios`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (!response.ok) {
      throw new Error(`Error al obtener los horarios: ${response.status} ${response.statusText}`);
    }
  
    return response.json();
  }
//(Get)obti/*datos Guardias"
async getAusencias(): Promise<any[]> {
  const response = await fetch(`${this.apiUrldatos}/ausencias`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener las ausencias: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
  //(Post)insrt/nombre/apellidos/curso/foto/horario Profesores"
  async inrtDatos(nombre: string, apellidos: string, curso: string, foto: string, horario?: Horario){
     
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
  //(Post)actu/horario(id)
  async updateHorario(id: number, horario: JSON): Promise<any> {
    try {
        const response = await fetch(`${this.apiUrldatos}/${id}/ac`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ horario }), 
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en la actualización de datos:', error);
        throw error;
    }
}
//(Post)insrt/horario/justificante (id_profesor) Guardias"
async insertGuardias(id_profesor: number, horario: JSON, fileData?: File): Promise<any> {
  const formData = new FormData();
  formData.append('id_profesor', id_profesor.toString());
  formData.append('horario', JSON.stringify(horario));
  if (fileData) {
    formData.append('file', fileData);
  }

  const response = await fetch(`${this.apiUrlGuardias}/guardias`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en la solicitud: ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

//(Post)lg/nombre/contraseña Credenciales
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
//Fn Cerrar Sesion
logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['']);
  }
//Fn Info de usuario en Sesion
getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
//Fn Datos de usuario en Sesion
getCurrentDataUser(): Observable<User | null> {
    return this.currentDataUser.asObservable();
  }

isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
