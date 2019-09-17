import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlyAdminUsersGuard } from '../../../admin/admin-user-guard';
import { CustomersComponent } from '../customers.component';
import { CustomerTypeModel } from './customer.model';
import { AuthGuard } from '../../../auth/auth-guard.service';
import { DistirbutorComponent } from '../distirbutor/distirbutor.component';
import { SectorComponent } from '../sector/sector.component';
import { OrderComponent } from '../order/order.component';
const routes: Routes = [
  {
    path: 'customer', children: [{ path: '', component: CustomersComponent }],
    canActivate: [AuthGuard]
  },
  {
    path: 'customerorder', children: [{ path: '', component: OrderComponent }],
    canActivate: [AuthGuard]
  },
  { path: 'distirbutor', children: [{ path: '', component: DistirbutorComponent }], canActivate: [AuthGuard] 
  },
  { path: 'sector', component: SectorComponent, canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CustomerRoutingModule { }
