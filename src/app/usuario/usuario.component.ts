import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HeaderComponent } from '../header/header.component';
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ModalComponent],  
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  userId: string | null = null;
  dataLoaded: boolean = false; 

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser(); 
    if (user) {
      this.userId = user.id_profesor;
    }
    this.authService.getCurrentDataUser().subscribe((data) => {
      if (data) {
        this.dataLoaded = true; 
      }
    });
  }

}