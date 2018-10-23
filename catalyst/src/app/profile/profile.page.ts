import { Component, OnInit } from '@angular/core';
import { RegisterAuthService } from "../services/register-auth.service";
import * as $ from 'jquery';
import {FormGroup} from "@angular/forms";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  id;
  firstname;
  lastname;
  username;
  email;
  organization;
  organizationname;
  message;
  editUsername = false;
  editPassword = false;
  editEmail = false;

  constructor(private authService: RegisterAuthService,
              private toastCtrl: ToastController) { }

  ngOnInit() {
    this.getProfile();
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


    getProfile() {
    this.authService.getProfile().subscribe(data => {
      if (data['success']) {
        this.id = data['user']._id;
        this.firstname = data['user'].firstname;
        this.lastname = data['user'].lastname;
        this.username = data['user'].username;
        this.email = data['user'].email;
        this.organization = data['user'].organization;
        this.getOrganization();
        this.message = data['message'];
      } else {
        this.message = data['message'];
      }
    })
  }

  getOrganization() {
    this.authService.getOrganization(this.organization).subscribe(data => {
      if (data['success']) {
        this.organizationname = data['organization'].organizationname;
      } else {
        this.message = data['message'];
      }
    })
  }

  changeUsername() {
    const newUsername = $( "#inputUserName" ).val();
    let validUsername = this.validateUsername(newUsername);
    if (validUsername) {
        const user = {
            newUsername : newUsername,
            identity: this.id,
        };

        this.authService.changeUsername(user).subscribe(data => {
            if (data['success']) {
                this.username = newUsername;
                this.message = data['message'];
                this.presentToast();
                return;
            } else {
                this.message = data['message'];
                this.presentToast();
                return;
            }
        });
    } else {
        this.message = 'Invalid Username';
        this.presentToast();
    }
  }

  changeEmail() {
        const newEmail = $( "#inputEmail" ).val();
        let validEmail = this.validateEmail(newEmail);
        if (validEmail) {
            const user = {
                newEmail : newEmail,
                identity: this.id,
            };
            this.authService.changeEmail(user).subscribe(data => {
                if (data['success']) {
                    this.email = data['email'];
                    this.message = data['message'];
                    this.presentToast();
                    return;
                } else {
                    this.message = data['message'];
                    this.presentToast();
                    return;
                }
            });
        } else {
            this.message = 'Invalid Email';
            this.presentToast();
        }
    }

  changePassword() {
        const newPassword = $( "#inputPassword" ).val();
        const oldPassword = $( "#oldPassword" ).val();
        let validPassword = this.validatePassword(newPassword);
        if (validPassword) {
            const user = {
                newPassword : newPassword,
                identity: this.id,
            };
            this.authService.checkPassword(oldPassword, this.username).subscribe(data => {
                if (data['success']) {
                    this.message = data['message'];
                    this.presentToast();
                    this.authService.changePassword(user).subscribe(data => {
                        if (data['success']) {
                            this.message = data['message'];
                            this.presentToast();
                            return;
                        } else {
                            this.message = data['message'];
                            this.presentToast();
                            return;
                        }
                    });
                } else {
                    this.message = data['message'];
                    this.presentToast();
                    return;
                }
            });
        } else {
            this.message = 'Invalid New Password';
            this.presentToast();
        }
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
  validateUsername(username) {
        // Create a regular expression
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        // Test username against regular expression
        if (regExp.test(username)) {
            return true; // Return as valid username
        } else {
            return false; // Return as invalid username
        }
  }

    // Function to validate password
    validatePassword(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{7,35}$/);
        // Test password against regular expression
        if (regExp.test(controls.value)) {
            return null; // Return as valid password
        } else {
            return { 'validatePassword': true }; // Return as invalid password
        }
    }
}
