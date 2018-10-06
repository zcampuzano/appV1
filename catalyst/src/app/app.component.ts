import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RegisterAuthService } from "./services/register-auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
      {
          title: 'Court',
          url: '/home',
          icon: 'basketball'
      },
      {
          title: 'Roster',
          url: '/athletes',
          icon: 'list'
      },
      {
          title: 'Games',
          url: '/games',
          icon: 'calendar'
      },
      {
          title: 'My Account',
          url: '/profile',
          icon: 'contact',
      }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: RegisterAuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['']);
  }
}
