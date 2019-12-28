import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginGaurd } from './login/shared/login-gaurd.service';
import { LoginAuthGraud } from './loginpage.gaurd.service';

const routes: Routes = [
  {
    path: 'auth', children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent
      // , canActivate:[LoginAuthGraud] 
    },
      { path: 'register', component: RegisterComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule { }
