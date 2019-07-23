import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './auth.service';
import { TokenStorage } from './token.storage';
import { AuthRoutingModule } from './auth-routing.module';
import { DistrictComponent } from './territory/district/district.component';
import { InputSwitchModule } from 'primeng/inputswitch';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,

    
    InputSwitchModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    DistrictComponent
  ],
  providers: [
    AuthService,
    TokenStorage
  ]
})
export class AuthModule { }
