import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorarioComponent } from "../horario/horario.component"; 
@Component({
  selector: 'app-modal',
  imports: [CommonModule, HorarioComponent],
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
