import { Component, OnInit } from '@angular/core';
import { SportAuthService } from "../services/sport-auth.service";
import { RegisterAuthService } from "../services/register-auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
})
export class GamesPage implements OnInit {
  games;
  message;
  messageClass;

  constructor(private sportService: SportAuthService,
              private authService: RegisterAuthService,
              private router: Router) { }

  ngOnInit() {
    this.getGames();
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
              this.getOrganDetails();
          }
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
