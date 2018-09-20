import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {RegisterAuthService} from "../services/register-auth.service";
import {Router} from "@angular/router";
import {AuthGuard} from "../guards/auth.guard";
import { ToastController } from "@ionic/angular";
// import {Toast} from "@ionic/angular/dist/types/components/toast/toast";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    previousUrl;
    messageClass;
    message;
    processing = false;
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: RegisterAuthService,
        private router: Router,
        private authGuard: AuthGuard,
        private toastCtrl: ToastController
    ) {
        this.createForm(); // Create Login Form when component is constructed
    }

    ionViewDidLoad() {

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

    // Function to create login form
    createForm() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required], // Username field
            password: ['', Validators.required] // Password field
        });
    }

    // Function to disable form
    disableForm() {
        this.form.controls['username'].disable(); // Disable username field
        this.form.controls['password'].disable(); // Disable password field
    }

    // Function to enable form
    enableForm() {
        this.form.controls['username'].enable(); // Enable username field
        this.form.controls['password'].enable(); // Enable password field
    }

    // Function to submit form and login user
    onLoginSubmit() {
        this.processing = true; // Used to submit button while is being processed
        this.disableForm(); // Disable form while being process
        // Create user object from user's input
        const user = {
            username: this.form.get('username').value, // Username input field
            password: this.form.get('password').value // Password input field
        }

        // Function to send login data to API
        this.authService.login(user).subscribe(data => {
            // Check if response was a success or error
            if (!data['success']) {
                this.messageClass = 'alert alert-danger'; // Set bootstrap error class
                this.message = data['message']; // Set error message
                this.presentToast();
                this.processing = false; // Enable submit button
                this.enableForm(); // Enable form for editting
            } else {
                this.messageClass = 'alert alert-success'; // Set bootstrap success class
                this.message = data['message']; // Set success message
                this.presentToast();
                // Function to store user's token in client local storage
                this.authService.storeUserData(data['token'], data['user'].role);
                console.log(data['user'].role);
                // After 2 seconds, redirect to dashboard page
                setTimeout(() => {
                    if (this.previousUrl) {
                        this.router.navigate([this.previousUrl]);
                    } else {
                        this.form.reset();
                        this.enableForm();
                        this.router.navigate(['/home']); // Navigate to dashboard view
                    }
                }, 0);
            }
        });

    }

    register() {
        this.form.reset();
        this.router.navigate(['/register']);
    }

    ngOnInit() {
        if (this.authGuard.redirectUrl && !this.authService.loggedIn()) {
            this.messageClass = 'alert alert-danger';
            this.message = 'You must be logged in to view that page';
            this.previousUrl = this.authGuard.redirectUrl;
            this.authGuard.redirectUrl = undefined;
        }
    }
}
