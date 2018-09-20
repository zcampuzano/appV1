import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
// import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class SportAuthService {
  // domain = 'http://192.168.1.70:8080'; // Development Domain - Mobile
  domain = 'http://localhost:8080'; // Development Domain - Web
  loginAuthToken;
  httpOptions;

  constructor(private http : HttpClient) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
      this.loadToken(); // Get token so it can be attached to headers
      // Headers configuration options
      this.httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json', // Format set to// JSON
              'authorization': this.loginAuthToken // Attach token
          })
      };
  }
  // Function to get token from client local storage
  loadToken() {
      this.loginAuthToken = localStorage.getItem('ng-jwt'); // Get token and asssign to variable to be used elsewhere
      // console.log('token boiys : ', this.loginAuthToken)
  }

  // Function to register user accounts
  createBaseballSchema(baseballSchema) {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.post(this.domain + '/sportAuthentication/createBaseballSchema', baseballSchema, this.httpOptions);
  }
  // Function to register user accounts
  createFootballSchema(footballSchema) {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.post(this.domain + '/sportAuthentication/createFootballSchema', footballSchema, this.httpOptions);
  }

  // Function to register user accounts
  createBasketballSchema(basketballSchema) {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.post(this.domain + '/sportAuthentication/createBasketballSchema', basketballSchema, this.httpOptions);
  }

  createAthlete(athlete) {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.post(this.domain + '/sportAuthentication/createAthlete', athlete, this.httpOptions);
  }

  createRecruit(recruit) {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.post(this.domain + '/sportAuthentication/createRecruit', recruit, this.httpOptions);
  }

  getAthletes() {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.get(this.domain + '/sportAuthentication/getAthletes', this.httpOptions);
  }

  getRecruits() {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.get(this.domain + '/sportAuthentication/getRecruits', this.httpOptions);
  }

  getSports() {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.get(this.domain + '/sportAuthentication/getSports', this.httpOptions);
  }

  getUser(id) {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.get(this.domain + '/sportAuthentication/getUser/' + id, this.httpOptions);
  }

  getAthlete(id) {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.get(this.domain + '/sportAuthentication/getAthlete/' + id, this.httpOptions);
  }

  getBasketballStat(id) {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.get(this.domain + '/sportAuthentication/getBasketballStat/' + id, this.httpOptions);
  }

  changeAthlete(athlete) {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.post(this.domain + '/sportAuthentication/changeAthlete', athlete, this.httpOptions);
  }
  changeBasketballSchema(basketBall) {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.post(this.domain + '/sportAuthentication/changeBasketballSchema', basketBall, this.httpOptions);
  }
}
