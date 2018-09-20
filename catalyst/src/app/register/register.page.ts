import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import { RegisterAuthService } from "../services/register-auth.service";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

//todo error messages

export class RegisterPage implements OnInit {
    form: FormGroup;
    organizationForm: FormGroup;
    message;
    messageClass;
    processing = false;
    emailValid;
    emailMessage;
    usernameValid;
    usernameMessage;
    organizations;
    isAdmin;
    organMessage;
    organValid;

    constructor(
        private formBuilder: FormBuilder,
        private authService: RegisterAuthService,
        private router: Router,
        private toastCtrl: ToastController
    ) {
        this.createForm();
        this.createOrganizationForm();
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

    // Function to create registration form
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
            // Email Input
            email: ['', Validators.compose([
                Validators.required, // Field is required
                Validators.minLength(5), // Minimum length is 5 characters
                Validators.maxLength(30), // Maximum length is 30 characters
                this.validateEmail // Custom validation
            ])],
            // Username Input
            username: ['', Validators.compose([
                Validators.required, // Field is required
                Validators.minLength(3), // Minimum length is 3 characters
                Validators.maxLength(15), // Maximum length is 15 characters
                this.validateUsername // Custom validation
            ])],
            // Password Input
            password: ['', Validators.compose([
                Validators.required, // Field is required
                Validators.minLength(7), // Minimum length is 8 characters
                Validators.maxLength(35), // Maximum length is 35 characters
                this.validatePassword // Custom validation
            ])],
            // Confirm Password Input
            confirm: ['', Validators.required], // Field is required
            organization : ['', Validators.required]
        }, { validator: this.matchingPasswords('password', 'confirm') }); // Add custom validator to form for matching passwords

    }

    // Function to create organization form
    createOrganizationForm() {
        this.organizationForm = this.formBuilder.group({
            // Organization Input
            organizationname: ['', Validators.compose([
                Validators.required, // Field is required
                this.validateOrganization // Custom validation
            ])],
            location: ['', Validators.compose([
                Validators.required, // Field is required
                this.validateOrganization // Custom validation
            ])]
        }, { validator: null}); // Add custom validator to form for matching passwords
    }

    // Function to disable the registration form
    disableForm() {
        this.form.controls['firstname'].disable();
        this.form.controls['lastname'].disable();
        this.form.controls['email'].disable();
        this.form.controls['username'].disable();
        this.form.controls['password'].disable();
        this.form.controls['confirm'].disable();
        this.form.controls['organization'].disable();

    }

    // Function to enable the registration form
    enableForm() {
        this.form.controls['firstname'].enable();
        this.form.controls['lastname'].enable();
        this.form.controls['email'].enable();
        this.form.controls['username'].enable();
        this.form.controls['password'].enable();
        this.form.controls['confirm'].enable();
        this.form.controls['organization'].enable();
    }

    // Function to disable the org form
    disableOrganizationForm() {
        this.organizationForm.controls['organizationname'].disable();
        this.organizationForm.controls['location'].disable();
    }

    // Function to enable the org form
    enableOrganizationForm() {
        this.organizationForm.controls['organizationname'].enable();
        this.organizationForm.controls['location'].enable();
    }

    // Function to validate e-mail is proper format
    validateEmail(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        // Test email against regular expression
        if (regExp.test(controls.value)) {
            return null; // Return as valid email
        } else {
            return { 'validateEmail': true }; // Return as invalid email
        }
    }

    // Function to validate username is proper format
    validateUsername(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        // Test username against regular expression
        if (regExp.test(controls.value)) {
            return null; // Return as valid username
        } else {
            return { 'validateUsername': true }; // Return as invalid username
        }
    }

    // Function to validate password
    validatePassword(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        // Test password against regular expression
        if (regExp.test(controls.value)) {
            return null; // Return as valid password
        } else {
            return { 'validatePassword': true }; // Return as invalid password
        }
    }

    // Funciton to ensure passwords match
    matchingPasswords(password, confirm) {
        return (group: FormGroup) => {
            // Check if both fields are the same
            if (group.controls[password].value === group.controls[confirm].value) {
                return null; // Return as a match
            } else {
                return { 'matchingPasswords': true }; // Return as error: do not match
            }
        };
    }

    // Function to submit form
    onRegisterSubmit() {
        console.log('69_420');
        this.processing = true; // Used to notify HTML that form is in processing, so that it can be disabled
        this.disableForm(); // Disable the form
        this.disableOrganizationForm();
        // Create user object form user's inputs
        if (this.form.get('organization').value === 'New') {
            const organName = (this.organizationForm.controls['organizationname'].value);
            const organLoc = (this.organizationForm.controls['location'].value);
            // const sportSchema = {
            //   baseball : this.createSportComponent.form.get('baseball').value,
            //   football : this.createSportComponent.form.get('football').value
            // };
            const organization = {
                organizationname : organName,
                location : organLoc
                // sport : sportSchema
            };
            // console.log(sportSchema.baseball);
            // console.log(sportSchema.football);
            this.authService.createOrganization(organization).subscribe(data => {
                if (data['success']) {
                    this.messageClass = 'alert alert-success'; // Set a success class
                    this.message = data['message']; // Set a success messagers
                    this.presentToast();
                    this.isAdmin = true;
                    const organID = data['organizationID'];
                    const user = {
                        firstname: this.form.get('firstname').value, // E-mail input field
                        lastname: this.form.get('lastname').value, // E-mail input field
                        email: this.form.get('email').value, // E-mail input field
                        username: this.form.get('username').value, // Username input field
                        password: this.form.get('password').value, // Password input field
                        role: this.isAdmin, // user/admin?
                        organization: organID, // new organization
                        // sport : sportSchema
                    };

                    // Function from authentication service to register user
                    this.authService.registerUser(user).subscribe(data => {
                        // Response from registration attempt
                        if (!data['success']) {
                            this.messageClass = 'alert alert-danger'; // Set an error class
                            this.message = data['message']; // Set an error message
                            this.presentToast();
                            this.processing = false; // Re-enable submit button
                            this.enableForm(); // Re-enable form
                            this.enableOrganizationForm();
                            this.generateOrgans();
                        } else {
                            this.messageClass = 'alert alert-success'; // Set a success class
                            this.message = data['message']; // Set a success message
                            this.presentToast();
                            // After 2 second timeout, navigate to the login page
                            setTimeout(() => {
                                this.router.navigate(['']); // Redirect to login view
                            }, 2000);
                        }
                    });

                } else {
                    if (!data['success']) {
                        this.messageClass = 'alert alert-danger'; // Set an error class
                        this.message = data['message']; // Set an error message
                        this.presentToast();
                        this.processing = false; // Re-enable submit button
                        this.enableForm(); // Re-enable form
                    }
                }
            });
        } else {
            this.isAdmin = false;
            // const sportSchema = {
            //   baseball : $( "#baseball" ).is(':checked'),
            //   football :  $( "#football" ).is(':checked')
            // };
            // console.log(sportSchema.baseball);
            // console.log(sportSchema.football);
            const user = {
                firstname: this.form.get('firstname').value, // E-mail input field
                lastname: this.form.get('lastname').value, // E-mail input field
                email: this.form.get('email').value, // E-mail input field
                username: this.form.get('username').value, // Username input field
                password: this.form.get('password').value, // Password input field
                role: this.isAdmin, // user/admin?
                organization : this.form.get('organization').value, // new organization
                // sport : sportSchema
            };

            // console.log(user);

            // Function from authentication service to register user
            this.authService.registerUser(user).subscribe(data => {
                // Resposne from registration attempt
                if (!data['success']) {
                    this.messageClass = 'alert alert-danger'; // Set an error class
                    this.message = data['message']; // Set an error message
                    this.presentToast();
                    this.processing = false; // Re-enable submit button
                    this.enableForm(); // Re-enable form
                } else {
                    this.messageClass = 'alert alert-success'; // Set a success class
                    this.message = data['message']; // Set a success message
                    this.presentToast();
                    // After 2 second timeout, navigate to the login page
                    setTimeout(() => {
                        this.router.navigate(['']); // Redirect to login view
                    }, 2000);
                }
            });
        }

    }

    // Function to check if e-mail is taken
    checkEmail() {
        // Function from authentication file to check if e-mail is taken
        this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
            // Check if success true or false was returned from API
            if (!data['success']) {
                this.emailValid = false; // Return email as invalid
                this.emailMessage = data['message']; // Return error message
            } else {
                this.emailValid = true; // Return email as valid
                this.emailMessage = data['message']; // Return success message
            }
        });
    }

    // Function to check if username is available
    checkUsername() {
        // Function from authentication file to check if username is taken
        this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
            // Check if success true or success false was returned from API
            if (!data['success']) {
                this. usernameValid = false; // Return username as invalid
                this.usernameMessage = data['message']; // Return error message
            } else {
                this.usernameValid = true; // Return username as valid
                this.usernameMessage = data['message']; // Return success message
            }
        });
    }

    generateOrgans() {
        this.authService.getOrganizations().subscribe(data => {
            // Check if success true or success false was returned from API
            if (!data['success']) {
                this.messageClass = 'alert alert-danger'; // Set an error class
                this.message = data['message']; // Set an error message
                this.presentToast();
                // this.processing = false; // Re-enable submit button
            } else {
                this.organizations = data['organList'];
            }
        });
    }

    // Function to validate username is proper format
    validateOrganization(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^[\w\-\s]+$/);
        // Test username against regular expression
        if (regExp.test(controls.value)) {
            return null; // Return as valid username
        } else {
            return { 'validateOrganization': true }; // Return as invalid username
        }
    }

    checkOrganization() {
        // Function from authentication file to check if username is taken
        this.authService.checkOrganization(this.organizationForm.get('organizationname').value).subscribe(data => {
            // Check if success true or success false was returned from API
            if (!data['success']) {
                this.organValid = false; // Return username as invalid
                this.organMessage = data['message']; // Return error message
            } else {
                this.organValid = true; // Return username as valid
                this.organMessage = data['message']; // Return success message
            }
        });
    }

    backToLogin() {
        this.form.reset();
        this.organizationForm.reset();
        this.router.navigate(['']);
    }

    ngOnInit() {
        this.authService.createRegisterToken().subscribe(data => {
            this.authService.storeUserData(data['token'], null);
            this.generateOrgans();
        });
    }

}
