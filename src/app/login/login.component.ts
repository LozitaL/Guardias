import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule,ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  
  async onSubmit() {
    const { username, password } = this.loginForm.value;

    try {
      
      const response = await lastValueFrom(this.authService.login(username, password));

      
      if (response && response.token) {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.authService.getCurrentUser().next(response); 
        this.router.navigate([`/usuario/${response.id_profesor}`]); 
        this.errorMessage = ''; 
      }
    } catch (error) {
      console.error('Error de login:', error);
      this.errorMessage = 'Has escrito de forma incorrecta el nombre de usuario o la contraseña.';
    }
  }
}
