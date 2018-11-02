import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RegisterAuthService} from "../services/register-auth.service";
import {SportAuthService} from "../services/sport-auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, FormArray} from "@angular/forms";
import {ToastController} from "@ionic/angular";

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
  dateDefault = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().slice(0,-1);

  constructor(private http: HttpClient,
              private sportService: SportAuthService,
              private authService: RegisterAuthService,
              private router: Router,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController) {
    this.createForm();
    this.generateOrgans();
    this.getAthletes();
  }

  ngOnInit() {
  }

  createForm() {
      this.form = this.formBuilder.group({
          // Date input
          date: [' '],
          // Away team
          away: [''],
          // home team
          home: [''],
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
      this.form.controls['home'].enable();
      this.disabled = false;
  }

  disableForm() {
      this.form.controls['date'].disable();
      this.form.controls['away'].disable();
      this.form.controls['home'].disable();
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
            // console.log(this.athletes);
        }
    });
  }

  cancelGame() {
      this.router.navigate(['/home']);
  }

    // Toast message
    async presentToast() {
        const toast = await this.toastCtrl.create({
            message: this.message,
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }

    //todo require atleast 5 players
  onGameSubmit() {
      this.disableForm(); // Disable the form
      // FORM CHECKS
      let date;
      if (this.form.controls['date'].value === "") {
          this.message = 'Please select a date';
          this.presentToast();
          this.enableForm();
          return;
      }
      if (this.form.controls['home'].value == this.form.controls['away'].value) {
          this.message = "Home and Away teams cannot be the same"
          this.presentToast();
          this.enableForm();
          return;
      }
      const basketballSchema = {
          PTA2 : 0
      };
      //todo reset forms on submit or once game is complete?
      this.sportService.createBasketballSchema(basketballSchema).subscribe(data =>{
          // console.log(data);
          if(data['success']) {
              this.message = data['message'];
              date = `${this.form.controls['date'].value.year.text}-${this.form.controls['date'].value.month.text}-${this.form.controls['date'].value.day.text}`;
              let game;
              if (data['organID'] === this.form.controls['home'].value) {
                  game = {
                      date: date,
                      home: {
                          ID: this.form.controls['home'].value,
                          athletes: this.athleteArr,
                          stat: data['basketballSchemaID']
                      },
                      away: {
                          ID: this.form.controls['away'].value,
                      },
                      h: true,
                  };
              } else {
                  game = {
                      date: date,
                      home: {
                          ID: this.form.controls['home'].value,
                      },
                      away: {
                          ID: this.form.controls['away'].value,
                          athletes: this.athleteArr,
                          stat: data['basketballSchemaID'],
                      },
                      h: false,
                  };
              }

              const lastSeason = data['seasons'].seasons.length - 1;
              const seasonID = data['seasons'].seasons[lastSeason];

              this.sportService.checkForGame(game).subscribe(data => {
                  console.log(data['message']);
                  if (data['success']) {
                      this.message = data['message'];
                      const seasonUpdate = {
                          seasonID: seasonID,
                          gameID: data['gameID'],
                      };
                      window.localStorage.setItem('currentGame', data['gameID']);
                      this.sportService.updateSeasonGames(seasonUpdate).subscribe(data => {
                          if (data['success']) {
                              this.message = data['message'];
                              console.log(this.message);
                              this.router.navigate(['/home']);
                          }
                      });
                      this.createGameStat(data['gameID']);
                  } else {
                      this.sportService.createGame(game).subscribe(data => {
                          console.log(data['message']);
                          if (data['success']) {
                              this.message = data['message'];
                              const seasonUpdate = {
                                  seasonID: seasonID,
                                  gameID: data['gameID'],
                              };
                              window.localStorage.setItem('currentGame', data['gameID']);
                              this.sportService.updateSeasonGames(seasonUpdate).subscribe(data => {
                                  if (data['success']) {
                                      this.message = data['message'];
                                      console.log(this.message);

                                      this.router.navigate(['/home']);
                                  }
                              })
                              this.createGameStat(data['gameID']);

                          } else {
                              this.message = data['message'];
                              this.presentToast();
                              console.log(this.message);
                          }
                      })
                  }
              })


          } else {
              this.message = data['message'];
              this.presentToast();
          }
      });

  }

  createGameStat(gameID) {

      for(let i = 0; i < this.athleteArr.length; i++) {
          const gameStat = {
              game: gameID,
              athlete: this.athleteArr[i],
          };
          this.sportService.createGameStat(gameStat).subscribe(data => {
              if (data['success']) {
                  this.message = data['message'];
              } else {
                  this.message = data['message'];
              }
          })
      }

  }

}
