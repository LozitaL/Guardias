import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodyComponent } from "../body/body.component"; 
@Component({
  selector: 'app-modal',
  imports: [CommonModule, BodyComponent],
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
