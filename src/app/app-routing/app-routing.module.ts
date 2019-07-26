import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { HomeComponent } from '../home/home.component';
import { MaintainanceComponent } from '../extra/maintainance/maintainance.component';
import { LoginAuthGraud } from '../auth/loginpage.gaurd.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: 'app/auth/auth.module#AuthModule', canActivate: [LoginAuthGraud] },
  { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule' },
  { path: 'oops', component: MaintainanceComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
  declarations: []
})

export class AppRoutingModule { }
