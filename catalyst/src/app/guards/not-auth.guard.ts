import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterAuthService } from "../services/register-auth.service";

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate {
  constructor(
      private authService: RegisterAuthService,
      private router: Router
  ) { }

  // Function to determine whether user is authorized to view route
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      // Check if user is logged in
      console.log(this.authService.loggedIn());
      if (this.authService.loggedIn()) {
          this.router.navigate(['/home']); // Return error, route to home
          return false; // Return false: user not allowed to view route
      } else {
          return true; // Return true: user is allowed to view route
      }
  }
}
