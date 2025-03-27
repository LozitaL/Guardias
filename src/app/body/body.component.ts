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
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentDataUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userD: User | null) => {
        if (userD) {
          this.userHorario = userD.horario;
        }
      });
  }

  getDias(): string[] {
    return this.userHorario ? Object.keys(this.userHorario) : [];
  }

  getHoras(dia: string): string[] {
    return this.userHorario && this.userHorario[dia] ? Object.keys(this.userHorario[dia]) : [];
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
    if (!horaKey || !this.userHorario?.[dia]?.[horaKey]) {
      return []; 
    }
  
    const datos = this.userHorario[dia][horaKey];
    if (!datos) {
      return []; 
    }
  
    return Array.isArray(datos) ? datos : (datos === "libre" ? [] : [datos]);
  }

  filasValidas(dia: any): number {
    return Object.values(dia).reduce((count: number, datos: any) => {
      return count + (Array.isArray(datos) ? datos.length : 1);
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}