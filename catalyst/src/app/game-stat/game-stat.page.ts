import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { RegisterAuthService } from "../services/register-auth.service";
import { SportAuthService } from "../services/sport-auth.service";

@Component({
  selector: 'app-game-stat',
  templateUrl: './game-stat.page.html',
  styleUrls: ['./game-stat.page.scss'],
})
export class GameStatPage implements OnInit {
  stat = '';
  id = '';
  team;
  athlete;
  name = '';
  player;
  number;
  position;
  messageClass;
  message;
  bball_schema;
  bball_schema_props;
  bball_schema_vals;


  constructor(private router: Router,
              private authService: RegisterAuthService,
              private sportService: SportAuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
      this.id = this.route.snapshot.params['id'];
      this.stat = this.route.snapshot.params['stat'];
      this.getStat();
  }

  getStat() {
      this.authService.getOrganization(this.id).subscribe(data => {
         if (data['success']) {
             console.log(data);
             this.name = data['organization'].organizationname;
             this.getTeamStat();
         } else {
             this.sportService.getAthlete(this.stat).subscribe(data => {
                 if (data['success']) {
                     // Check if success true or success false was returned from API
                     if (!data['success']) {
                         this.messageClass = 'alert alert-danger'; // Set an error class
                         this.message = data['message']; // Set an error message
                         // this.processing = false; // Re-enable submit button
                     } else {
                         this.name = `${data['athlete'].firstname} ${data['athlete'].lastname}` ;
                         this.position = data['athlete'].position;
                         this.number = data['athlete'].number;
                         this.player = true;
                     }
                 }
             });
             this.getGameStat();
         }
      });
  }

  getGameStat() {
      this.sportService.getGameStat(this.id, this.stat).subscribe(data => {
          console.log(data);
          if (!data['success']) {
              this.messageClass = 'alert alert-danger'; // Set an error class
              this.message = data['message']; // Set an error message
              // this.processing = false; // Re-enable submit button
          } else {
              // Step 1. Get all the object keys.
              this.bball_schema = data['gameStat'];
              let evilResponseProps = Object.keys(this.bball_schema);
              // Step 2. Create an empty array.
              let goodResponseProps = [];
              let goodResponseVals = [];
              // Step 3. Iterate throw all keys.
              for(let prop in evilResponseProps) {
                  goodResponseProps.push(evilResponseProps[prop]);
              }
              this.bball_schema_props = goodResponseProps;
              for (let i = 0; i < this.bball_schema_props.length; i++) {
                  goodResponseVals.push(this.bball_schema[this.bball_schema_props[i]])
              }
              this.bball_schema_vals = goodResponseVals
          }
      })
  }

  getTeamStat() {
      this.sportService.getBasketballStat(this.stat).subscribe(data => {
          if (!data['success']) {
              this.messageClass = 'alert alert-danger'; // Set an error class
              this.message = data['message']; // Set an error message
              // this.processing = false; // Re-enable submit button
          } else {
              // Step 1. Get all the object keys.
              this.bball_schema = data['basketballSchema'];
              let evilResponseProps = Object.keys(this.bball_schema);
              // Step 2. Create an empty array.
              let goodResponseProps = [];
              let goodResponseVals = [];
              // Step 3. Iterate throw all keys.
              for(let prop in evilResponseProps) {
                  goodResponseProps.push(evilResponseProps[prop]);
              }
              this.bball_schema_props = goodResponseProps.slice(1, goodResponseProps.length - 1);
              for (let i = 0; i < this.bball_schema_props.length; i++) {
                  goodResponseVals.push(this.bball_schema[this.bball_schema_props[i]])
              }
              this.bball_schema_vals = goodResponseVals
          }
      })
  }



}
