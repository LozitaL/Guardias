import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../interfaces/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-body',
  imports: [CommonModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {
  userHorario: any | null = null;
  id_profesor: any | null = null;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentDataUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userD: User | null) => {
        if (userD) {
          this.id_profesor = userD.id;
          this.userHorario = userD.horario;
        }
      });
  }

  getDias(): string[] {
    return this.userHorario ? Object.keys(this.userHorario) : [];
  }
  
  getHoras(dia: string): string[] {
    return this.userHorario?.[dia] ? Object.keys(this.userHorario[dia]) : [];
  }

  getDatos(dia: string, hora: string): any[] {
    const horasMap: { [key: string]: string } = {
      "8:30-9:25": "hora1",
      "9:25-10:20": "hora2",
      "10:40-11:35": "hora3",
      "11:35-12:30": "hora4",
      "12:40-13:35": "hora5",
      "13:35-14:30": "hora6"
    };
  
    const horaKey = horasMap[hora]; 
        const datos = this.userHorario?.[dia]?.[horaKey];
    if (!datos || datos === "libre") {
      return [];
    }
    return Array.isArray(datos) ? datos : [datos];
  }
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  modoEdicion: boolean = false;
  Editar(): void{
    this.modoEdicion = true;
  }
  onEditarCelda(dia: string, hora: string, campo: 'asignatura' | 'curso' | 'clase', valor: string) {
    const horasMap: { [key: string]: string } = {
      "8:30-9:25": "hora1",
      "9:25-10:20": "hora2",
      "10:40-11:35": "hora3",
      "11:35-12:30": "hora4",
      "12:40-13:35": "hora5",
      "13:35-14:30": "hora6"
    };
  
    const horaKey = horasMap[hora];
  
    if (!this.userHorario) {
      this.userHorario = {};
    }
  
    if (!this.userHorario[dia]) {
      this.userHorario[dia] = {};
    }
  
    if (!this.userHorario[dia][horaKey] || this.userHorario[dia][horaKey] === 'libre') {
      this.userHorario[dia][horaKey] = [{}];
    }
  
    const celda = this.userHorario[dia][horaKey][0];
  
    if (valor.trim() === '') {
      delete celda[campo];
    } else {
      celda[campo] = valor;
    }
      if (!celda.asignatura && !celda.curso && !celda.clase) {
      this.userHorario[dia][horaKey] = 'libre';
    }
  }

  guardarCambios() {
    if (!this.userHorario) return;

    const idProfesor = parseInt(this.id_profesor);

    this.authService.updateHorario(idProfesor, this.userHorario)
        .then(response => {
            console.log('Datos actualizados:', response);
            this.modoEdicion = false;
        })
        .catch(error => {
            console.error('Error al actualizar datos:', error);
        });
}
  }
