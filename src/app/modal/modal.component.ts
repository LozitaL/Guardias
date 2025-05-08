import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorarioComponent } from "../horario/horario.component"; 
import { GuardiasComponent } from '../guardias/guardias.component';
import { AusenciasComponent } from '../ausencias/ausencias.component';
import { DocadminComponent } from '../docadmin/docadmin.component';
import { DocusersComponent } from '../docusers/docusers.component';
import { AuthService } from '../auth.service';
import { User } from '../interfaces/user.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-modal',
  imports: [CommonModule, HorarioComponent,GuardiasComponent,AusenciasComponent,DocadminComponent,DocusersComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  standalone: true,
})
export class ModalComponent {
  currentView: string = ''; 
  roll: string = 'usuario'
  constructor(private authService: AuthService) {}
  private destroy$ = new Subject<void>();
  ngOnInit(): void {
      this.authService.getCurrentDataUser()
        .pipe(takeUntil(this.destroy$))
        .subscribe((userD: User | null) => {
          if (userD) {
            this.roll = userD.roll;
          }
        });}
    
  changeView(view: string): void {
    this.currentView = view;

  }
}
