import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RegisterAuthService} from "../services/register-auth.service";
import {SportAuthService} from "../services/sport-auth.service";
import {Router} from "@angular/router";
// import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import { ModalController } from "@ionic/angular";

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
              private router: Router,
              private sportService: SportAuthService,
              private modalCtrl: ModalController) {}


  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  createSeason() {
    const basketballSchema = {
      PTA2 : 0
    }
    this.sportService.createBasketballSchema(basketballSchema).subscribe(data => {
      console.log(data);
      if(data['success']) {
          this.message = data['message'];
          const season = {
              year: '2018',
              basketballStat: data['basketballSchemaID'],
              athletes: [],
              games: []
          };

          const organID = data['organID'];

          this.sportService.createSeason(season).subscribe(data => {
            if (data['success']) {
              this.message = data['message'];
              const orgUpdate = {
                  organID: organID,
                  seasonID: data['seasonID']
              };
              this.sportService.updateOrgSeason(orgUpdate).subscribe(data => {
                  if (data['success']) {
                      this.message = data['message'];
                  }
              })

            } else {
              this.message = data['message'];
            }

          })
      } else {
          this.message = data['message'];
      }
    });


  }

  createGame() {
      this.router.navigate(['/game']);
  }

  athlete() {
    this.router.navigate(['/add-athlete']);
  }

}

