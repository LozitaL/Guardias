import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../interfaces/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-guardias',
  imports: [],
  templateUrl: './guardias.component.html',
  styleUrl: './guardias.component.css'
})

export class GuardiasComponent {
  userHorario: any | null = null;
  id_profesor: any | null = null;
  horas: any | null = null;
  private destroy$ = new Subject<void>();
  constructor(private authService: AuthService) {}

  getDatos(dia: string): any[] {
    
        const datos = this.userHorario[dia];
    if (!datos || datos === "") {
      return [];
    }
    return datos;
  }
  
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickCelda(celda: any, dia: string, idx: number): void {
    const registro = {
      hora: celda.hora || this.horas[idx],
      curso: celda.curso,
      asignatura: celda.asignatura,
      comentario: "falta: ", 
      fecha: new Date().toISOString(),
      profesor: this.id_profesor,
      dia: dia
    };
  
    this.guardarFalta(registro); //para mañana , añadir que se envie el registro y si ha obtenido registro de la tabla horario, id_profesor = a x tiempo "esta semana" se muestre el cambio guardado en la tabla horario
  }
}
