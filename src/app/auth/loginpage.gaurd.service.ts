import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class LoginAuthGraud implements CanActivate {

  constructor(public router: Router, private authService: AuthService) { }

  canActivate() {
    if (!this.authService.isAuthenticated()) {
      console.log("NOT LOGGED IN ")
      return true;
    }
    // not logged in so redirect to login page with the return url
    console.log("LOGGED IN")
    return false;
  }
}
