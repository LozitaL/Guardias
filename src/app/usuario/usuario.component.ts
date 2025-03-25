import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule],  
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