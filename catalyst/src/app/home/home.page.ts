import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RegisterAuthService} from "../services/register-auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  orgData = null;

  constructor(public http: HttpClient, private authService: RegisterAuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  athlete() {
    this.router.navigate(['/add-athlete']);
  }

}

