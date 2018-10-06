import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import * as $ from 'jquery';
import { RegisterAuthService } from "../services/register-auth.service";
import { SportAuthService } from "../services/sport-auth.service";
import { forEach } from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-single-athlete',
  templateUrl: './single-athlete.page.html',
  styleUrls: ['./single-athlete.page.scss'],
})
export class SingleAthletePage implements OnInit {
  message;
  messageClass;
  firstname = '';
  lastname = '';
  id = '';
  number = '';
  position = '';
  bball_id = '';
  bball_schema;
  bball_schema_props;
  bball_schema_vals;

  constructor(private route: ActivatedRoute,
              private authService: RegisterAuthService,
              private sportService: SportAuthService) { }

  ngOnInit() {
      this.id = this.route.snapshot.params['id'];
      this.getAthlete();

  }

  getAthlete() {
      this.sportService.getAthlete(this.id).subscribe(data => {
          // Check if success true or success false was returned from API
          if (!data['success']) {
              this.messageClass = 'alert alert-danger'; // Set an error class
              this.message = data['message']; // Set an error message
              // this.processing = false; // Re-enable submit button
          } else {
              this.firstname = data['athlete'].firstname;
              this.lastname = data['athlete'].lastname;
              this.position = data['athlete'].position;
              this.number = data['athlete'].number;
              this.id = this.route.snapshot.params['id'];
              this.bball_id = data['athlete'].basketballStat;
              // console.log(this.bball_id, "BBALL ID")
              this.getBasketballStat();
          }
      });
  }

  getBasketballStat() {
      this.sportService.getBasketballStat(this.bball_id).subscribe(data => {
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
      });
  }

}
