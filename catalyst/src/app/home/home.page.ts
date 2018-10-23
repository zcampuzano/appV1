import {Component, OnChanges} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RegisterAuthService} from "../services/register-auth.service";
import {SportAuthService} from "../services/sport-auth.service";
import {Router} from "@angular/router";
// import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import { AlertController, ToastController } from "@ionic/angular";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnChanges {
  orgData = null;
  teamPoints = 0;
  message;
  gameID;
  date;
  droppedData: string;
  dropOverActive2;
  dropOverActive3;
  drop = 0;
  roster = [];
  organization;
  activeRoster = [];
  dropType;
  confirm;
  currentGame;
  game;

  constructor(public http: HttpClient,
              private authService: RegisterAuthService,
              private sportService: SportAuthService,
              private router: Router,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController) {}


  ngOnInit() {
      this.setActiveGame();
      this.getAthletes();
  }

  ngOnChanges() {
      this.setActiveGame();
      this.getAthletes();
  }

  //todo save game data to organization basketball stat
  getAthletes() {
      if (window.localStorage.getItem('currentGame')) {
          this.currentGame = true;
          this.sportService.getCurrentGame().subscribe(data => {
              if (data['success']) {
                  this.organization = data['organization'];
                  this.gameID = data['game'];
                  this.sportService.getGame(data['game']).subscribe(data => {
                      if (data['success']) {
                          this.game = data['game'];
                          console.log(this.game);
                      } else {
                          this.message = data['message'];
                      }
                  })
                  this.sportService.getGameAthletes(data['game']).subscribe(data => {
                      if (data['success']) {
                          this.roster = data['athleteList'];
                      }
                  })
              }
          })
      } else {
          this.currentGame = false;
          this.message = 'Start a game';
          this.presentToast();
      }

  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
        message: this.message,
        duration: 2000
    });
    toast.present();
  }

  async presentAlert() {
    this.getAthletes();
    if (!window.localStorage.getItem('currentGame')) {
        this.message = 'Start a game';
        this.presentToast();
    } else {
        let inputs = [];
        for (let i = 0; i < this.roster.length; i++) {
            if (this.roster[i].organization === this.organization) {
                inputs = inputs.concat([{
                    name: `athlete${i}`,
                    type: 'checkbox',
                    label: `${this.roster[i].lastname} (${this.roster[i].number})`,
                    value: this.roster[i]._id,
                    checked: this.activeRoster.includes(this.roster[i]._id)
                }])
            }
        }

        const alert = await this.alertCtrl.create({
            header: 'Active Players',
            inputs: inputs,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: data => {
                        console.log('Confirm Ok');
                        if (data.length !== 5) {
                            this.message = 'Must select 5 players';
                            this.presentToast();
                            this.presentAlert();
                        } else {
                            this.activeRoster = data;
                            window.localStorage.setItem('active', JSON.stringify(this.activeRoster));
                            console.log(this.activeRoster);
                        }
                    }
                }
            ]
        });


        await alert.present();
    }
  }

  setActiveGame() {
      let storedRoster = JSON.parse(window.localStorage.getItem('active'));
      if (storedRoster) {
          this.activeRoster = storedRoster;
      }
      let storedScore = JSON.parse(window.localStorage.getItem('teamPoints'));
      if (storedScore) {
          this.teamPoints = storedScore;
      }
  }

  createGame() {
      this.router.navigate(['/game']);
  }

  onDrop2(event){
        console.log('Element was dropped 2', event);
        this.dropOverActive2 = false;
        this.dropOverActive3 = false;
        setTimeout(() => {
            if (this.confirm) {
                this.drop = 2;
                this.teamPoints += 2;
                this.dropType = '2';
                this.message = '2 Points';
                window.localStorage.setItem('teamPoints', JSON.stringify(this.teamPoints));
                console.log(this.teamPoints);
                this.confirm = false;
                setTimeout(() => {this.dropType = '0';}, 3000);
            } else {
                this.drop = 20;
                this.message = 'Miss';
                console.log(this.teamPoints);
            }
        }, 1000);

  }

  onDrop3(event){
      console.log('Element was droppped 3', event);
      this.dropOverActive2 = false;
      this.dropOverActive3 = false;
      setTimeout(() => {
         if (this.dropType !== '2' && this.confirm) {
             this.drop = 3;
             this.teamPoints += 3;
             this.message = '3 Points';
             window.localStorage.setItem('teamPoints', JSON.stringify(this.teamPoints));
             console.log(this.teamPoints);
             this.confirm = false;
         } else if (this.dropType !== '2' && !this.confirm) {
             this.drop = 30;
             this.message = 'Miss';
             console.log(this.teamPoints);
         }

      }, 2000);
  }

  confirmScore() {
      this.confirm = true;
  }

  saveGame() {
      for (let i = 0; i < this.roster.length; i++) {
          let storedStat = JSON.parse(window.localStorage.getItem(this.roster[i]._id));
          if (storedStat) {
              const gameStat = {
                  game: this.gameID,
                  athlete: this.roster[i]._id,
                  stat: JSON.parse(window.localStorage.getItem(this.roster[i]._id))
              }

              this.sportService.updateGameStat(gameStat).subscribe(data => {
                  if (data['success']) {
                      console.log(data['gameStatID']);
                      this.message = data['message'];
                      window.localStorage.removeItem(gameStat.athlete);
                  } else {
                      this.message = data['message'];
                  }
              })
          }

      }

      window.localStorage.removeItem('currentGame');
      window.localStorage.removeItem('active');
      window.localStorage.removeItem('saveID');
      window.localStorage.removeItem('teamPoints');
      this.roster = [];
      this.activeRoster = [];
      this.teamPoints = 0;
      this.currentGame = false;

  }

}

