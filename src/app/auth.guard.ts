import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    const requestedUserId = route.paramMap.get('id'); 

    if (!currentUser) {
      this.router.navigate(['']);
      return false;
    }

    if (currentUser.id_profesor !== Number(requestedUserId)) {
      this.router.navigate([`/usuario/${currentUser.id_profesor}`]);
      return false;
    }
    return true;
  }
}
