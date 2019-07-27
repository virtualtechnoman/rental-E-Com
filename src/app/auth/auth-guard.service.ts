import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public router: Router) { }

  canActivate() {
    const user = (<any>window).user;
    if (localStorage.getItem('AuthToken')) {
      console.log("LOGGED IN")
      return true
    }
    // not logged in so redirect to login page with the return url
    else {
      this.router.navigateByUrl('login');
      return false;
    }

  }
}
