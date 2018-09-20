import { Component, OnInit } from '@angular/core';
import { SportAuthService } from "../services/sport-auth.service";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-athlete',
  templateUrl: './add-athlete.page.html',
  styleUrls: ['./add-athlete.page.scss'],
})
export class AddAthletePage implements OnInit {
  form: FormGroup;
  message;
  messageClass;
  athletes;
  formVisible = false;
  private processing: boolean;

  constructor(
      private formBuilder: FormBuilder,
      private sportService: SportAuthService,
      private router: Router
  ) {
      this.createForm();
  }

  ngOnInit() {
    this.getAthletes();
  }

  createForm() {
      this.form = this.formBuilder.group({
          // First Name Input
          firstname: ['', Validators.compose([
              Validators.required, // Field is required
              this.validateUsername // Custom validation
          ])],
          // Last Name Input
          lastname: ['', Validators.compose([
              Validators.required, // Field is required
              this.validateUsername // Custom validation
          ])],
          number: ['', ([//Validators.compose([
              //Validators.required, // Field is required
              //this.validateUsername // Custom validation
              //todo add custom number validation
          ])]
      }, { validator: null});
  }

  // Function to validate username is proper format
  validateUsername(controls) {
      // Create a regular expression
      const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
      // Test username against regular expression
      if (regExp.test(controls.value)) {
          return null; // Return as valid username
      } else {
          return { 'validateUsername': true } // Return as invalid username
      }
      //todo allow names less than 3 characters
  }

  makeVisible() {
      this.formVisible = !this.formVisible;
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
      console.log(this.athletes);
      //todo only allow user to see athletes in their organization
  }

  onAthleteCreateSubmit() {
      this.processing = true; // Used to notify HTML that form is in processing, so that it can be disabled
      this.disableForm(); // Disable the form

      let basketballSchema = {
          PTA2 : 0
      };

      this.sportService.createBasketballSchema(basketballSchema).subscribe(data => {
        console.log(data);
          if (data['success']) {
              this.messageClass = 'alert alert-success'; // Set a success class
              this.message = data['message']; // Set a success messagers
              const athlete = {
                  firstname: this.form.get('firstname').value,
                  lastname: this.form.get('lastname').value,
                  number: this.form.get('number').value,
                  basketballStat :  data['basketballSchemaID'],
                  organization : data['organID']
              };
              // console.log(data);
              this.sportService.createAthlete(athlete).subscribe( data => {
                // console.log(athlete);
                  if (data['success']) {
                      this.messageClass = 'alert alert-success'; // Set a success class
                      this.message = data['message']; // Set a success messagers
                  } else {
                      this.messageClass = 'alert alert-danger'; // Set an error class
                      this.message = data['message']; // Set an error message
                      this.processing = false; // Re-enable submit button
                      this.enableForm(); // Re-enable form
                  }
              })
          } else {
              this.messageClass = 'alert alert-danger'; // Set an error class
              this.message = data['message']; // Set an error message
              this.processing = false; // Re-enable submit button
              this.enableForm(); // Re-enable form
          } //data success end if
      });
      setTimeout(() => {
          window.location.reload(true);// Redirect to login view
      }, 1000);
  }

  onAthleteClick(_id, firstname, lastname) {
      this.router.navigate(['/dashboard' + '/' + firstname + lastname + '/' + _id]);
  }

  // Function to disable the registration form
  disableForm() {
      this.form.controls['firstname'].disable();
      this.form.controls['lastname'].disable();
      this.form.controls['number'].disable();
  }

  // Function to enable the registration form
  enableForm() {
      this.form.controls['firstname'].enable();
      this.form.controls['lastname'].enable();
      this.form.controls['number'].enable();
  }

  goBack() {
      this.router.navigate(['/home']);
  }

}
