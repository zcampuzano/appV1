import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RegisterAuthService} from "../services/register-auth.service";
import {SportAuthService} from "../services/sport-auth.service";
import {Router} from "@angular/router";
// import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  orgData = null;
  message;
  date;


  constructor(public http: HttpClient,
              private authService: RegisterAuthService,
              private router: Router) {
  }


  createGame() {
      this.router.navigate(['/game']);
  }


}

