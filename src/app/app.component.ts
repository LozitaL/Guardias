import { Component } from '@angular/core';
import { Route, RouterModule,RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
@Component({

  selector: 'app-root',
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
  standalone: true,  
  
})
export class AppComponent {
  title = 'Guardias2.0';
}


