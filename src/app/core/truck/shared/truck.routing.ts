import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../auth/auth-guard.service';
import { VehicleComponent } from '../vehicle/vehicle.component';
import { DriverComponent } from '../driver/driver.component';

const routes: Routes = [
  {
    path: 'vehicle', children: [{ path: '', component: VehicleComponent }],
    canActivate: [AuthGuard]
  },
  {
    path: 'drivers', children: [{ path: '', component: DriverComponent }],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TruckRoutingModule { }
