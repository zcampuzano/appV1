import { Component, OnInit } from '@angular/core';
import { SportAuthService } from "../services/sport-auth.service";
import { RegisterAuthService } from "../services/register-auth.service";
import { Router } from "@angular/router";
import { LoadingController, ToastController } from "@ionic/angular";

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
})
export class GamesPage implements OnInit {
  games = [];
  message;
  messageClass;
  organization;

  constructor(private sportService: SportAuthService,
              private authService: RegisterAuthService,
              private router: Router,
              private loadCtrl: LoadingController,
              private toastCtrl: ToastController) { }

  ngOnInit() {
    this.presentLoading();
  }

  getGames() {
      this.sportService.getGames().subscribe(data => {
          // Check if success true or success false was returned from API
          if (!data['success']) {
              this.messageClass = 'alert alert-danger'; // Set an error class
              this.message = data['message']; // Set an error message
              // this.processing = false; // Re-enable submit button
          } else {
              this.games = data['gameList'];
              this.organization = data['organID'];
              this.getOrganDetails();
          }
      });
  }

  async presentToast(message) {
      const toast = await this.toastCtrl.create({
          message: message,
          duration: 1000,
          cssClass: 'normalToast'
      });

      toast.present();
  }

  async presentLoading() {

      const loading = await this.loadCtrl.create({
          message: ''
      });

      await loading.present().then(() => {
          this.getGames();
          const interval = setInterval(() => {
              if (this.games.length > 0) {
                  loading.dismiss();
                  clearInterval(interval);
              } else if (this.message) {
                  this.presentToast(this.message);
              }
          }, 500);
          setTimeout(() => {
              if (this.games.length === 0) {
                  this.presentToast('Request timeout');
                  loading.dismiss();
                  clearInterval(interval);
              }
          }, 10000)
      });

  }

  getOrganDetails() {
      for (let i = 0; i < this.games.length; i++) {
          this.authService.getOrganization(this.games[i].home.ID).subscribe(data => {
              // Check if success true or sucess false was returned form API
              if (!data['success']) {
                  this.message = data['message'];
              } else {
                  //console.log(data['organization'].organizationname);
                  this.games[i].home.name = data['organization'].organizationname;
              }
          });
          this.authService.getOrganization(this.games[i].away.ID).subscribe(data => {
              // Check if success true or sucess false was returned form API
              if (!data['success']) {
                  this.message = data['message'];
              } else {
                  //console.log(data['organization'].organizationname);
                  this.games[i].away.name = data['organization'].organizationname;
              }
          });
      }
  }

  selectGame(_id) {
      this.router.navigate(['/games' + '/' + _id]);
  }

}
