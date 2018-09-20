import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";

const jwtHelper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class RegisterAuthService {
  // domain = 'http://192.168.1.70:8080'; // Development Domain - Mobile
  domain = 'http://localhost:8080'; // Development Domain - Web
  loginAuthToken;
  role;
  httpOptions;

  constructor(private http: HttpClient) { }

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

    createRegisterToken() {
        return this.http.get(this.domain + '/authentication/createRegisterToken');
    }

    // Function to get token from client local storage
    loadToken() {
        this.loginAuthToken = localStorage.getItem('ng-jwt'); // Get token and asssign to variable to be used elsewhere
    }

    createOrganization(organization) {
        return this.http.post(this.domain + '/authentication/createOrganization', organization);
    }

    getAllOrganizationUsers() {
        this.createAuthenticationHeaders(); // Create headers before sending to API
        return this.http.get(this.domain + '/authentication/getAllOrganizationUsers', this.httpOptions);
    }

    getOrganizations() {
        this.createAuthenticationHeaders(); // Create headers before sending to API
        return this.http.get(this.domain + '/authentication/getOrganizations', this.httpOptions);
    }
    // Function to register user accounts
    registerUser(user) {
        return this.http.post(this.domain + '/authentication/register', user);
    }

    // Function to check if username is taken
    checkUsername(username) {
        return this.http.get(this.domain + '/authentication/checkUsername/' + username);
    }

    // Function to check if e-mail is taken
    checkEmail(email) {
        return this.http.get(this.domain + '/authentication/checkEmail/' + email);
    }

    // Function to check if e-mail is taken
    checkOrganization(organizationname) {
        return this.http.get(this.domain + '/authentication/checkOrganization/' + organizationname);
    }

    // Function to login user
    login(user) {
        return this.http.post(this.domain + '/authentication/login', user);
    }

    // Function to logout
    logout() {
        this.loginAuthToken = null; // Set token to null
        localStorage.clear(); // Clear local storage
    }

    // Function to store user's data in client local storage
    storeUserData(token, presence) {
        localStorage.setItem('ng-jwt', token); // Set token in local storage
        localStorage.setItem('presence', presence); // Set token in local storage
        this.loginAuthToken = token; // Assign token to be used elsewhere
        this.role = presence;
    }

    // Function to get user's profile data
    getProfile() {
        this.createAuthenticationHeaders(); // Create headers before sending to API
        return this.http.get(this.domain + '/authentication/profile', this.httpOptions);
    }

    // change userna
    changeUsername(user) {
        //this.createAuthenticationHeaders(); // Create headers before sending to API
        return this.http.post(this.domain + '/authentication/changeUsername', user);
    }

    // Function to check if user is logged in
    loggedIn() {
        // console.log(!jwtHelper.isTokenExpired(localStorage.getItem('ng-jwt')));
        // console.log('presence', localStorage.getItem('presence'));
        if (localStorage.getItem('presence') !== 'null') {
            // let temp = !jwtHelper.isTokenExpired(localStorage.getItem('ng-jwt'));
            return !jwtHelper.isTokenExpired(localStorage.getItem('ng-jwt'));
        }
    }

    isAdmin() {
        return localStorage.getItem('presence');
    }
}
