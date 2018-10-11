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
  deg360 = 'deg360';
  top;
  right;
  webkitTransform;
  adddeg45Class: boolean = true;
  overlayHidden: boolean = true;
  droppedData: string;
  dropOverActive2;
  dropOverActive3;

  constructor(public http: HttpClient,
              private authService: RegisterAuthService,
              private router: Router) {}


  createGame() {
      this.router.navigate(['/game']);
  }

  dragEnd(event) {
        console.log('Element was dragged end', event);

        this.right = 20;
  }

  pressEvent(event){
        event.preventDefault();
        this.deg360=" ";
        console.log('Element was tapped', event);
        ;

  }

  onDrop2(event){
        console.log('Element was droppped 2', event);
        this.dropOverActive2 = false;
        this.dropOverActive3 = false;
        this.message = '2 Points';
  }

  onDrop3(event){
      console.log('Element was droppped 3', event);
      this.dropOverActive2 = false;
      this.dropOverActive3 = false;
      this.message = '3 Points';
  }

  dragStart(event){
        console.log('drag started', event);

  }


}

