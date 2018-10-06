import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import * as $ from 'jquery';
import { RegisterAuthService } from "../services/register-auth.service";
import { SportAuthService } from "../services/sport-auth.service";
import { forEach } from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.page.html',
  styleUrls: ['./single-game.page.scss'],
})
export class SingleGamePage implements OnInit {
    message;
    messageClass;
    date = '';
    home = {
      ID: '',
      name: '',
      stat: '',
    };
    away = {
        ID: '',
        name: '',
        stat: '',
    };
    id = '';
    athletes;

    constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: RegisterAuthService,
              private sportService: SportAuthService) { }

  ngOnInit() {
      this.id = this.route.snapshot.params['id'];
      this.getGame();
      this.getAthletes();
  }

  getGame() {
      this.sportService.getGame(this.id).subscribe(data => {
          // Check if success true or success false was returned from API
          if (!data['success']) {
              this.messageClass = 'alert alert-danger'; // Set an error class
              this.message = data['message']; // Set an error message
              // this.processing = false; // Re-enable submit button
          } else {
              this.home.ID = data['game'].home.ID;
              this.away.ID = data['game'].away.ID;
              this.home.stat = data['game'].home.stat;
              this.away.stat = data['game'].away.stat;
              this.date = data['game'].date;
              this.id = this.route.snapshot.params['id'];
              this.getOrganDetails();
              // this.bball_id = data['athlete'].basketballStat;
              // console.log(this.bball_id, "BBALL ID")
              // this.getBasketballStat();
          }
      });
  }

  getAthletes() {
        this.sportService.getGameAthletes(this.id).subscribe(data => {
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

  getOrganDetails() {
    this.authService.getOrganization(this.home.ID).subscribe(data => {
        // Check if success true or sucess false was returned form API
        if (!data['success']) {
            this.message = data['message'];
        } else {
            //console.log(data['organization'].organizationname);
            this.home.name = data['organization'].organizationname;
        }
    });
    this.authService.getOrganization(this.away.ID).subscribe(data => {
        // Check if success true or sucess false was returned form API
        if (!data['success']) {
            this.message = data['message'];
        } else {
            //console.log(data['organization'].organizationname);
            this.away.name = data['organization'].organizationname;
        }
    });

  }

  selectStat(_id, stat) {
      this.router.navigate(['/game' + '/' + _id + '/' + stat]);
  }

}
