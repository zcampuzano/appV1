import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RegisterAuthService} from "../services/register-auth.service";
import {SportAuthService} from "../services/sport-auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, FormArray} from "@angular/forms";

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  form: FormGroup;
  organizations;
  athletes;
  messageClass;
  message;
  processing;
  gameData;
  athleteArr = [];
  disabled = false;

  constructor(private http: HttpClient,
              private sportService: SportAuthService,
              private authService: RegisterAuthService,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.createForm();
    this.generateOrgans();
    this.getAthletes();
  }

  ngOnInit() {
  }

  createForm() {
      this.form = this.formBuilder.group({
          // Date input
          date: [''],
          // Away team
          away: ['']
      }, { validator: null});
  }


  addActive(athleteID) {
      let added = false;
      for (let i = 0; i < this.athleteArr.length; i++) {
          if (athleteID === this.athleteArr[i]) {
              added = true;
              this.athleteArr.splice(i, 1);
          }
      }

      if (!added) {this.athleteArr.push(athleteID);}
      console.log(this.athleteArr);
  }


  enableForm() {
      this.form.controls['date'].enable();
      this.form.controls['away'].enable();
      this.disabled = false;
  }

  disableForm() {
      this.form.controls['date'].disable();
      this.form.controls['away'].disable();
      this.disabled = true;
  }

  generateOrgans() {
      this.authService.getOrganizations().subscribe(data => {
          // Check if success true or success false was returned from API
          if (!data['success']) {
              // this.messageClass = 'alert alert-danger'; // Set an error class
              // this.message = data['message']; // Set an error message
              // this.presentToast();
              // this.processing = false; // Re-enable submit button
          } else {
              this.organizations = data['organList'];
          }
      });
  }

  getAthletes() {
    this.sportService.getAthletes().subscribe(data => {
        // Check if success true or success false was returned from API
        if (!data['success']) {
            this.messageClass = 'alert alert-danger'; // Set an error class
            this.message = data['message']; // Set an error message
            // this.processing = false; // Re-enable submit button
        } else {
            this.athletes = data['athleteList'];
            console.log(this.athletes);
        }
    });
  }

  cancelGame() {
      this.router.navigate(['/home']);
  }

  onGameSubmit() {
      this.disableForm(); // Disable the form
      const basketballSchema = {
          PTA2 : 0
      };

      //todo check for existing game before creating new one
      this.sportService.createBasketballSchema(basketballSchema).subscribe(data =>{
          console.log(data);
          if(data['success']) {
              this.message = data['message'];
              let date = `${this.form.controls['date'].value.year.text}-${this.form.controls['date'].value.month.text}-${this.form.controls['date'].value.day.text}`;
              console.log(date);
              const game = {
                  date: date,
                  home: {
                      ID: data['organID'],
                      athletes: this.athleteArr,
                      stat: data['basketballSchemaID']
                  },
                  away: {
                      ID: this.form.controls['away'].value,
                      athletes: [],
                      stat: null,
                  }
              };

              const lastSeason = data['seasons'].seasons.length - 1;
              const seasonID = data['seasons'].seasons[lastSeason];

              this.sportService.createGame(game).subscribe(data => {
                  if (data['success']) {
                      this.message = data['message'];
                      const seasonUpdate = {
                          seasonID: seasonID,
                          gameID: data['gameID'],
                      };
                      this.sportService.updateSeasonGames(seasonUpdate).subscribe(data => {
                         if (data['success']) {
                             this.message = data['message'];
                             console.log(this.message);
                             this.router.navigate(['/home']);
                         }
                      })

                  } else {
                      this.message = data['message'];
                      console.log(this.message);
                  }
              })

          } else {
              this.message = data['message'];
          }
      });

  }


}
