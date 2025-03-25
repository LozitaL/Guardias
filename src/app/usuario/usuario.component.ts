import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, HeaderComponent],  
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  userId: string | null = null;
  
  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser(); 
    
    this.userId = user.id_profesor;
  }

}