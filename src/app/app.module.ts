import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { AuthHeaderInterceptor } from './interceptors/header.interceptor';
import { CatchErrorInterceptor } from './interceptors/http-error.interceptor';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MaintainanceComponent } from './extra/maintainance/maintainance.component';
import { LoginGaurd } from './auth/login/shared/login-gaurd.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { LoginAuthGraud } from './auth/loginpage.gaurd.service';
import { DataTablesModule } from 'angular-datatables';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { UserModule } from './core/user/user.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MaintainanceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DataTablesModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,

    AdminModule,
    AuthModule,
    AppRoutingModule,
    SharedModule,
    
    // core Modules
    UserModule,
    // ngPrime
    InputSwitchModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    LoginAuthGraud,
    LoginGaurd,
    ToastrService,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHeaderInterceptor,
    multi: true,
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: CatchErrorInterceptor,
    multi: true,
  }],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
