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
  message;
  gameID;
  date;
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
  teamGameStat = {
      identity : null,
      PTA2 : 0, PTM2: 0, PTA3 : 0, PTM3 : 0, AST : 0, BLK : 0, DRB : 0, FTA : 0, FTM : 0, ORB : 0,
      PF : 0, STL : 0, TO : 0, ASTPG : null, STLPG : null, PTP2 : 0, PTP3 : 0, AST_TO_RATIO : 0,
      BLKPG : null, FGP : 0, FGA : 0, FGM : 0, FTP : 0, GP : null, MINPG : 0, OPP : 0, OPPG : null,
      PFPG : null, PPG : null, RPG : null, TOPG : null, MIN : null, PTS : 0, TRB : 0, FF : null,
      TECHF : null, DQ : null, GS : null, TF : null, W : null, L : null, T : null
  };
  athleteOverallStat = {
      identity : null,
      PTA2 : 0, PTM2: 0, PTA3 : 0, PTM3 : 0, AST : 0, BLK : 0, DRB : 0, FTA : 0, FTM : 0, ORB : 0,
      PF : 0, STL : 0, TO : 0, ASTPG : null, STLPG : null, PTP2 : 0, PTP3 : 0, AST_TO_RATIO : 0,
      BLKPG : null, FGP : 0, FGA : 0, FGM : 0, FTP : 0, GP : null, MINPG : 0, OPP : 0, OPPG : null,
      PFPG : null, PPG : null, RPG : null, TOPG : null, MIN : null, PTS : 0, TRB : 0, FF : null,
      TECHF : null, DQ : null, GS : null, TF : null, W : null, L : null, T : null, _id : null
  };
  teamOverallStat = {
      identity : null,
      PTA2 : 0, PTM2: 0, PTA3 : 0, PTM3 : 0, AST : 0, BLK : 0, DRB : 0, FTA : 0, FTM : 0, ORB : 0,
      PF : 0, STL : 0, TO : 0, ASTPG : null, STLPG : null, PTP2 : 0, PTP3 : 0, AST_TO_RATIO : 0,
      BLKPG : null, FGP : 0, FGA : 0, FGM : 0, FTP : 0, GP : null, MINPG : 0, OPP : 0, OPPG : null,
      PFPG : null, PPG : null, RPG : null, TOPG : null, MIN : null, PTS : 0, TRB : 0, FF : null,
      TECHF : null, DQ : null, GS : null, TF : null, W : null, L : null, T : null, _id : ''
  };

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
          this.teamGameStat.PTS = storedScore;
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
                this.teamGameStat.PTS += 2;
                this.dropType = '2';
                this.message = '2 Points';
                window.localStorage.setItem('teamPoints', JSON.stringify(this.teamGameStat.PTS));
                this.confirm = false;
                setTimeout(() => {this.dropType = '0';}, 3000);
            } else {
                this.drop = 20;
                this.message = 'Miss';
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
             this.teamGameStat.PTS += 3;
             this.message = '3 Points';
             window.localStorage.setItem('teamPoints', JSON.stringify(this.teamGameStat.PTS));
             this.confirm = false;
         } else if (this.dropType !== '2' && !this.confirm) {
             this.drop = 30;
             this.message = 'Miss';
         }

      }, 2000);
  }

  confirmScore() {
      this.confirm = true;
  }

  //todo error handling and success notification
  saveGame() {
      for (let i = 0; i < this.roster.length; i++) {
          let storedStat = JSON.parse(window.localStorage.getItem(this.roster[i]._id));
          if (storedStat) {
              const gameStat = {
                  game: this.gameID,
                  athlete: this.roster[i]._id,
                  stat: JSON.parse(window.localStorage.getItem(this.roster[i]._id))
              }

              this.addToTeam(gameStat.stat);
              this.computeAthleteOverallStat(this.roster[i]._id, gameStat.stat);

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

      this.computeTeamGameStat();

      window.localStorage.removeItem('currentGame');
      window.localStorage.removeItem('active');
      window.localStorage.removeItem('saveID');
      window.localStorage.removeItem('teamPoints');
      this.roster = [];
      this.activeRoster = [];
      this.currentGame = false;
  }

  addToTeam(stat) {
      let gameProps = Object.keys(stat);
      for (let prop in gameProps) {
          this.teamGameStat[gameProps[prop]] += stat[gameProps[prop]];
      }
  }

  computeTeamGameStat() {
      this.teamGameStat.PTP2 = this.teamGameStat.PTM2/this.teamGameStat.PTA2;
      this.teamGameStat.PTP3 = this.teamGameStat.PTM3/this.teamGameStat.PTA3;
      this.teamGameStat.AST_TO_RATIO = (this.teamGameStat.TO !== 0 ? this.teamGameStat.AST/this.teamGameStat.TO : this.teamGameStat.AST);
      this.teamGameStat.FGA = this.teamGameStat.PTA2 + this.teamGameStat.PTA3;
      this.teamGameStat.FGM = this.teamGameStat.PTM2 + this.teamGameStat.PTM3;
      this.teamGameStat.FGP = this.teamGameStat.FGM/this.teamGameStat.FGA;
      this.teamGameStat.FTP = this.teamGameStat.FTM/this.teamGameStat.FTA;
      this.teamGameStat.TRB = this.teamGameStat.ORB + this.teamGameStat.DRB;
      this.teamGameStat.identity = this.organization === this.game.home.ID ? this.game.home.stat : this.game.away.stat;

      console.log(this.teamGameStat);
      this.sportService.changeBasketballSchema(this.teamGameStat).subscribe(data => {
          if (data['success']) {
              console.log(data['newSchema']);
              this.computeTeamOverallStat();
              return 0;
          } else {
              return -1;
          }
      })
  }

  computeTeamOverallStat() {
      this.sportService.checkForSeason().subscribe(data => {
          if (data['success'] && data['season']) {
              //console.log(this.teamOverallStat.identity);
              this.sportService.getBasketballStat(data['stat']).subscribe(data => {
                  if (data['success']) {
                      let teamOverallProps = Object.keys(data['basketballSchema']);
                      let stat = data['basketballSchema'];
                      for (let prop in teamOverallProps) {
                          this.teamOverallStat[teamOverallProps[prop]] = stat[teamOverallProps[prop]];
                      }
                      console.log(this.teamGameStat);
                      let teamGameProps = Object.keys(this.teamGameStat);
                      for (let prop in teamGameProps) {
                          this.teamOverallStat[teamGameProps[prop]] += this.teamGameStat[teamGameProps[prop]];
                      }

                      this.teamOverallStat.identity = data['basketballSchema']._id;

                      this.teamOverallStat.GP += 1;
                      this.teamOverallStat.PTS += (this.teamGameStat.PTM2 * 2) + (this.teamGameStat.PTM3 * 3) + this.teamGameStat.FTM;
                      this.teamOverallStat.PPG += this.teamOverallStat.PTS/this.teamOverallStat.GP;
                      this.teamOverallStat.PTP2 = this.teamOverallStat.PTM2/this.teamOverallStat.PTA2;
                      this.teamOverallStat.PTP3 = this.teamOverallStat.PTM3/this.teamOverallStat.PTA3;
                      this.teamOverallStat.AST_TO_RATIO = (this.teamGameStat.TO !== 0 ? this.teamOverallStat.AST/this.teamOverallStat.TO : this.teamOverallStat.AST);
                      this.teamOverallStat.FGA = this.teamOverallStat.PTA2 + this.teamOverallStat.PTA3;
                      this.teamOverallStat.FGM = this.teamOverallStat.PTM2 + this.teamOverallStat.PTM3;
                      this.teamOverallStat.FGP = this.teamOverallStat.FGM/this.teamOverallStat.FGA;
                      this.teamOverallStat.FTP = this.teamOverallStat.FTM/this.teamOverallStat.FTA;
                      this.teamOverallStat.TRB = this.teamOverallStat.ORB + this.teamOverallStat.DRB;
                      this.teamOverallStat.ASTPG += this.teamOverallStat.AST/this.teamOverallStat.GP;
                      this.teamOverallStat.STLPG += this.teamOverallStat.STL/this.teamOverallStat.GP;
                      this.teamOverallStat.BLKPG += this.teamOverallStat.BLK/this.teamOverallStat.GP;
                      this.teamOverallStat.PFPG += this.teamOverallStat.PF/this.teamOverallStat.GP;
                      this.teamOverallStat.RPG = this.teamOverallStat.TRB/this.teamOverallStat.GP;
                      this.teamOverallStat.TOPG = this.teamOverallStat.TO/this.teamOverallStat.GP;

                      console.log(this.teamOverallStat);
                      this.sportService.changeBasketballSchema(this.teamOverallStat).subscribe(data => {
                          if (data['success']) {
                              console.log(data['newSchema']);
                              this.teamOverallStat = {
                                  identity : null,
                                  PTA2 : 0, PTM2: 0, PTA3 : 0, PTM3 : 0, AST : 0, BLK : 0, DRB : 0, FTA : 0, FTM : 0, ORB : 0,
                                  PF : 0, STL : 0, TO : 0, ASTPG : null, STLPG : null, PTP2 : 0, PTP3 : 0, AST_TO_RATIO : 0,
                                  BLKPG : null, FGP : 0, FGA : 0, FGM : 0, FTP : 0, GP : null, MINPG : 0, OPP : 0, OPPG : null,
                                  PFPG : null, PPG : null, RPG : null, TOPG : null, MIN : null, PTS : 0, TRB : 0, FF : null,
                                  TECHF : null, DQ : null, GS : null, TF : null, W : null, L : null, T : null, _id : null
                              };
                              this.teamGameStat = {
                                  identity : null,
                                  PTA2 : 0, PTM2: 0, PTA3 : 0, PTM3 : 0, AST : 0, BLK : 0, DRB : 0, FTA : 0, FTM : 0, ORB : 0,
                                  PF : 0, STL : 0, TO : 0, ASTPG : null, STLPG : null, PTP2 : 0, PTP3 : 0, AST_TO_RATIO : 0,
                                  BLKPG : null, FGP : 0, FGA : 0, FGM : 0, FTP : 0, GP : null, MINPG : 0, OPP : 0, OPPG : null,
                                  PFPG : null, PPG : null, RPG : null, TOPG : null, MIN : null, PTS : 0, TRB : 0, FF : null,
                                  TECHF : null, DQ : null, GS : null, TF : null, W : null, L : null, T : null
                              };
                              return 0;
                          } else {
                              return -1;
                          }
                      })

                  }
              })
          }
      })
  }

  computeAthleteOverallStat(id, gameStat) {
      this.sportService.getAthlete(id).subscribe(data => {
          if (data['success']) {
              this.athleteOverallStat.identity = data['athlete'].basketballStat;
              this.sportService.getBasketballStat(data['athlete'].basketballStat).subscribe(data => {
                  if (data['success']) {
                      let athleteOverallProps = Object.keys(data['basketballSchema']);
                      let stat = data['basketballSchema'];
                      for (let prop in athleteOverallProps) {
                          this.athleteOverallStat[athleteOverallProps[prop]] = stat[athleteOverallProps[prop]];
                      }
                      let athleteGameProps = Object.keys(gameStat);
                      for (let prop in athleteGameProps) {
                          this.athleteOverallStat[athleteGameProps[prop]] += gameStat[athleteGameProps[prop]];
                      }

                      this.athleteOverallStat.GP += 1;
                      this.athleteOverallStat.PTS += (gameStat.PTM2 * 2) + (gameStat.PTM3 * 3) + gameStat.FTM;
                      this.athleteOverallStat.PPG += this.athleteOverallStat.PTS/this.athleteOverallStat.GP;
                      this.athleteOverallStat.PTP2 = this.athleteOverallStat.PTM2/this.athleteOverallStat.PTA2;
                      this.athleteOverallStat.PTP3 = this.athleteOverallStat.PTM3/this.athleteOverallStat.PTA3;
                      this.athleteOverallStat.AST_TO_RATIO = (this.teamGameStat.TO !== 0 ? this.athleteOverallStat.AST/this.athleteOverallStat.TO : this.athleteOverallStat.AST);
                      this.athleteOverallStat.FGA = this.athleteOverallStat.PTA2 + this.athleteOverallStat.PTA3;
                      this.athleteOverallStat.FGM = this.athleteOverallStat.PTM2 + this.athleteOverallStat.PTM3;
                      this.athleteOverallStat.FGP = this.athleteOverallStat.FGM/this.athleteOverallStat.FGA;
                      this.athleteOverallStat.FTP = this.athleteOverallStat.FTM/this.athleteOverallStat.FTA;
                      this.athleteOverallStat.TRB = this.athleteOverallStat.ORB + this.athleteOverallStat.DRB;
                      this.athleteOverallStat.ASTPG += this.athleteOverallStat.AST/this.athleteOverallStat.GP;
                      this.athleteOverallStat.STLPG += this.athleteOverallStat.STL/this.athleteOverallStat.GP;
                      this.athleteOverallStat.BLKPG += this.athleteOverallStat.BLK/this.athleteOverallStat.GP;
                      this.athleteOverallStat.PFPG += this.athleteOverallStat.PF/this.athleteOverallStat.GP;
                      this.athleteOverallStat.RPG = this.athleteOverallStat.TRB/this.athleteOverallStat.GP;
                      this.athleteOverallStat.TOPG = this.athleteOverallStat.TO/this.athleteOverallStat.GP;

                      console.log(this.athleteOverallStat);
                      this.sportService.changeBasketballSchema(this.athleteOverallStat).subscribe(data => {
                          if (data['success']) {
                              console.log(data['newSchema']);
                              this.athleteOverallStat = {
                                  identity : null,
                                  PTA2 : 0, PTM2: 0, PTA3 : 0, PTM3 : 0, AST : 0, BLK : 0, DRB : 0, FTA : 0, FTM : 0, ORB : 0,
                                  PF : 0, STL : 0, TO : 0, ASTPG : null, STLPG : null, PTP2 : 0, PTP3 : 0, AST_TO_RATIO : 0,
                                  BLKPG : null, FGP : 0, FGA : 0, FGM : 0, FTP : 0, GP : null, MINPG : 0, OPP : 0, OPPG : null,
                                  PFPG : null, PPG : null, RPG : null, TOPG : null, MIN : null, PTS : 0, TRB : 0, FF : null,
                                  TECHF : null, DQ : null, GS : null, TF : null, W : null, L : null, T : null, _id : null
                              };
                          } else {
                              return -1;
                          }
                      })

                  }
              })
          }
      })
  }


}

