import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public router: Router) { }

  canActivate() {
    const user = (<any>window).user;
    if (localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigateByUrl('login');
      return false;
    }

  }
}
