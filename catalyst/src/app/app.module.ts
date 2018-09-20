import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import { IonicModule, IonicRouteStrategy, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {RegisterAuthService} from "./services/register-auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/not-auth.guard";
// import { JwtModule, JwtHelperService } from "@auth0/angular-jwt";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RegisterAuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthGuard,
    NotAuthGuard
  ],
  bootstrap: [AppComponent],
  exports: [
      FormsModule,
      ReactiveFormsModule
  ],
})
export class AppModule {}
