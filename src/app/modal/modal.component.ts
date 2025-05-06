import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorarioComponent } from "../horario/horario.component"; 
import { GuardiasComponent } from '../guardias/guardias.component';
import { AusenciasComponent } from '../ausencias/ausencias.component';
@Component({
  selector: 'app-modal',
  imports: [CommonModule, HorarioComponent,GuardiasComponent,AusenciasComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  standalone: true,
})
export class ModalComponent {
  currentView: string = ''; 

  changeView(view: string): void {
    this.currentView = view;
  }
}
