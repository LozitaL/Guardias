import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../interfaces/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-horario',
  imports: [],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css'
})
export class HorarioComponent  implements OnDestroy{
  userHorario: any | null = null;
  id_profesor: any | null = null;
  nombre : string = "";
  todosHorarios: any[] = [];
  private destroy$ = new Subject<void>();
  coincidenciasGuardias: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {

    this.authService.getCurrentDataUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userD: User | null) => {
        if (userD) {
          this.id_profesor = userD.id;
          this.userHorario = userD.horario;     
          this.nombre = userD.nombre;
        }
      });
      this.authService.getHorariosProfesores().then(horarios => {
        this.todosHorarios = horarios;      
        this.coincidenciasGuardias = this.buscarGuardiasCoincidentes(horarios);
      });
  }
  buscarGuardiasCoincidentes(horarios: any[]): any[] {
    const coincidencias: { dia: string; hora: string; profesores: string[] }[] = [];
    const dias = ["lunes", "martes", "miércoles", "jueves", "viernes"];
    for (const dia of dias) {
      const numFranjas = horarios[0]?.horario[dia]?.length || 0;
      for (let i = 0; i < numFranjas; i++) {
        const profesoresEnGuardia = horarios
          .filter(h => h.horario[dia] && h.horario[dia][i]?.asignatura?.toLowerCase() === "guardias")
          .map(h => h.nombre);
  
        const horaValida = horarios
          .map(h => h.horario[dia]?.[i]?.hora)
          .find(hora => hora && hora.trim() !== "");
  
        if (profesoresEnGuardia.length > 1 && horaValida) {
          coincidencias.push({
            dia,
            hora: horaValida,
            profesores: profesoresEnGuardia
          });
        }
      }
    }
    return coincidencias;
  }
  /*getDias(): string[] {
    return this.userHorario ? Object.keys(this.userHorario) : [];
  }*/
  //dia:[clase:,asig:,curso:,hora:,]
  getDatos(dia: string): any[] {
    /*{"Lunes":
	  [{"clase":"Matemáticas","curso":"2","asignatura":"algo","hora":"8:30-9:25"},*/
        const datos = this.userHorario[dia];
    for (let index = 0; index < 5; index++) {
      if(typeof datos[index] !== 'object' || datos[index] === null ){
       datos[index] = {"hora":"","clase":"","curso":"","asignatura":""};
      }
    }
    if (!datos || datos === "") {
      return [];
    }
    return datos;
  }
  //IMPORTANTE, cierra los observables por fugas
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  modoEdicion: boolean = false;
  addGuardia: boolean = false;
  //Editar Horario
  Editar(): void{
    this.modoEdicion = true;
  }
  //Fn Guarda el valor de cada celda en Horario
  onEditarCelda(dia: string, campo: 'asignatura' | 'curso' | 'clase' | 'hora', valor: string, idx: number, hora: string) {
    if (!this.userHorario) {
      this.userHorario = {};
    }
  
    if (!this.userHorario[dia]) {
      this.userHorario[dia] = [];
    }
  
    if (!this.userHorario[dia][idx]) {
      this.userHorario[dia][idx] = {};
    }
   

    const celda = this.userHorario[dia][idx];
    if (valor.trim() === '') {
      delete celda[campo];
    } else {
      celda[campo] = valor;
    }
    if (campo === 'asignatura' && (valor.toLowerCase() === 'guardias')) {
      const coincidencia = this.coincidenciasGuardias.find(
        c => c.dia === dia && c.hora === hora
      );
      if (coincidencia) {
        celda['clase'] = coincidencia.profesores.join(' ');
      } else {
        celda['clase'] = this.nombre; 
      }
    }
    if (!celda.asignatura && !celda.curso && !celda.clase) {
      this.userHorario[dia][idx] = {"hora":hora,"clase":"","curso":"","asignatura":""};
    }
    if (typeof this.userHorario[dia][idx] !== 'object' || this.userHorario[dia][idx] === null) {
      this.userHorario[dia][idx] = {"hora":hora,"clase":"","curso":"","asignatura":""};
    }
  }
  //Fn para mostrar profes en guardias
  getProfesoresPorDiaYHora(horarios: any[], dia: string, hora: string): string[] {
    return horarios
      .filter(h =>
        h.horario[dia]?.some(
          (franja: any) =>
            franja.hora === hora && franja.asignatura?.toLowerCase() === 'guardia'
        )
      )
      .map(h => h.nombre);
  }
  //Fn para actualizar horario
  guardarCambios() {
    if (!this.userHorario) return;
  
    const idProfesor = parseInt(this.id_profesor);
  
    this.authService.updateHorario(idProfesor, this.userHorario)
      .then(response => {
        this.modoEdicion = false;
      })
      .catch(error => {
        console.error('Error al actualizar datos:', error);
      });
  }

  }
