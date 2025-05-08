import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../interfaces/user.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-guardias',
  imports: [],
  templateUrl: './guardias.component.html',
  styleUrl: './guardias.component.css'
})

export class GuardiasComponent {
  userHorario: any | null = null;
    id_profesor: any | null = null;
    nombre : string = "";
    todosHorarios: any[] = [];
    private destroy$ = new Subject<void>();
    guardias: any[] = [];
    ausencias: any [] = [];
    horario: any[] = [];
    faltas: any[] = [];
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.getCurrentDataUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userD: User | null) => {
        if (userD) {
          this.id_profesor = userD.id;
          this.userHorario = userD.horario;
          this.nombre = userD.nombre;
          this.guardias = this.getGuardiasDeHorario(this.userHorario);
        }
      });
  
    this.authService.getAusencias().then((ausencias) => {
      this.ausencias = ausencias.map(a => ({
        ...a,
        horario: typeof a.horario === 'string' ? JSON.parse(a.horario) : a.horario
      }));
      this.extractHorarios();
      this.faltas = this.extractFaltasData();
      console.log(this.faltas);
    });
  }

getGuardiasDeHorario(userHorario: any): { dia: string, hora: string, nombres: string }[] {
  const resultado: { dia: string, hora: string, nombres: string }[] = [];
  if (!userHorario) return resultado;

  const dias = Object.keys(userHorario);
  for (const dia of dias) {
    const franjas = userHorario[dia];
    if (!Array.isArray(franjas)) continue;
    franjas.forEach((franja: any) => {
      if (
        franja &&
        franja.asignatura &&
        franja.asignatura.trim().toLowerCase().startsWith('guardia') &&
        franja.clase &&
        franja.clase.trim() !== ''
      ) {
        resultado.push({
          dia,
          hora: franja.hora,
          nombres: franja.clase.trim()
        });
      }
    });
  }
  return resultado;
}

extractHorarios() {
  this.horario = this.ausencias.map(ausencia => ausencia.horario);
}

extractFaltasData() {
  const faltasData: any[] = [];

  this.horario.forEach(horarioItem => {
    horarioItem.faltas.forEach((falta: any) => {
      if (falta && falta.curso && falta.clase && falta.hora && falta.fecha && falta.fecha.dian) {
        faltasData.push({
          dian: falta.fecha.dian,
          hora: falta.hora,
          curso: falta.curso,
          clase: falta.clase,
          fecha: falta.fecha,
          nombreProfesor: horarioItem.nombre
        });
      }
    });
  });
  return faltasData;
}

}

