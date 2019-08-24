import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlyAdminUsersGuard } from '../../../admin/admin-user-guard';
// import { CustomersComponent } from '../customers.component';
// import { CustomerTypeModel } from './customer.model';
import { AuthGuard } from '../../../auth/auth-guard.service';
import { TicketsComponent } from '../tickets/tickets.component';
// import { DistirbutorComponent } from '../distirbutor/distirbutor.component';
// import { SectorComponent } from '../sector/sector.component';
const routes: Routes = [
  {
    path: 'tickets', children: [{ path: '', component: TicketsComponent }],
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SupportRoutingModule { }
