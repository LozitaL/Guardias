import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { User } from '../interfaces/user.model';
@Component({
  selector: 'app-header',
  imports: [CommonModule],
  providers:[],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userName: string | null = null;
  userLName: string | null = null;
  userFoto: string | null = null;
  userCurso: string | null = null;
  userHorario: JSON | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentDataUser().subscribe((userD: User | null) => {
      if (userD) {
        this.userName = userD.nombre;
        this.userLName = userD.apellidos;
        this.userFoto = userD.foto;
        this.userCurso = userD.curso;
        this.userHorario = userD.horario;
      }
    });
  }
  onLogout() {
    this.authService.logout(); 
  }
}
