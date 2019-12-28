import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../auth/auth-guard.service';
import { OrderComponent } from '../order/order.component';
import { ReturnOrderComponent } from '../return-order/return-order.component';
import { ChallanComponent } from '../challan/challan.component';
import { ReturnorderchallanComponent } from '../returnorderchallan/returnorderchallan.component';

const routes: Routes = [
    {
        path: 'orders', children: [{ path: '', component: OrderComponent }],
        canActivate: [AuthGuard]
    },
    {
        path: 'returnorder', children: [{ path: '', component: ReturnOrderComponent }],
        canActivate: [AuthGuard]
    },
    {
        path: 'challan', children: [{ path: '', component: ChallanComponent }],
        canActivate: [AuthGuard]
    },
    {
        path: 'rchallan', children: [{ path: '', component: ReturnorderchallanComponent }],
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class OrderRoutingModule { }
