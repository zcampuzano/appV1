import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterAuthService } from "../services/register-auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  redirectUrl = null;

  constructor(
      private authService: RegisterAuthService,
      private router: Router
  ) { }

  // Function to check if user is authorized to view route
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // Check if user is logged in
      if (this.authService.loggedIn()) {
          return true; // Return true: User is allowed to view route
      } else {
          this.redirectUrl = state.url; // Grab previous url
          this.router.navigate(['']); // Return error and route to login page
          return false; // Return false: user not authorized to view page
      }
  }
}
