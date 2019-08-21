import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlyAdminUsersGuard } from '../../../admin/admin-user-guard';
// import { CustomersComponent } from '../customers.component';
// import { CustomerTypeModel } from './customer.model';
import { AuthGuard } from '../../../auth/auth-guard.service';
import { StateComponent } from '../state/state.component';
import { CityComponent } from '../city/city.component';
import { AreaComponent } from '../area/area.component';
// import { DistirbutorComponent } from '../distirbutor/distirbutor.component';
// import { SectorComponent } from '../sector/sector.component';
const routes: Routes = [
  {
    path: 'state', children: [{ path: '', component: StateComponent }],
    canActivate: [AuthGuard]
  },
  {
    path: 'city', children: [{ path: '', component: CityComponent }],
    canActivate: [AuthGuard]
  },
  {
    path: 'area', children: [{ path: '', component: AreaComponent }],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LocationRoutingModule { }
