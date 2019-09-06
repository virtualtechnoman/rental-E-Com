import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlyAdminUsersGuard } from '../../../admin/admin-user-guard';
// import { CustomersComponent } from '../customers.component';
// import { CustomerTypeModel } from './customer.model';
import { AuthGuard } from '../../../auth/auth-guard.service';
import { RouteComponent } from '../route/route.component';
import { CustomerRouteManagementComponent } from '../customer-route-management/customer-route-management.component';
// import { DistirbutorComponent } from '../distirbutor/distirbutor.component';
// import { SectorComponent } from '../sector/sector.component';
const routes: Routes = [
  {
    path: 'route', children: [{ path: '', component: RouteComponent }],
    canActivate: [AuthGuard]
  },
  {
    path: 'customerroute', children: [{ path: '', component: CustomerRouteManagementComponent }],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RouteRoutingModule { }
