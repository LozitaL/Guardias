import { Component } from '@angular/core';
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
export class HorarioComponent {
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
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  modoEdicion: boolean = false;
  
  Editar(): void{
    this.modoEdicion = true;
  }
  onEditarCelda(dia: string, campo: 'asignatura' | 'curso' | 'clase' | 'hora', valor: string, idx: number) {
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
  
    if (!celda.asignatura && !celda.curso && !celda.clase) {
      this.userHorario[dia][idx] = {"hora":"","clase":"","curso":"","asignatura":""};
    }
    if (typeof this.userHorario[dia][idx] !== 'object' || this.userHorario[dia][idx] === null) {
      this.userHorario[dia][idx] = {"hora":"","clase":"","curso":"","asignatura":""};
    }
  }
  

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
