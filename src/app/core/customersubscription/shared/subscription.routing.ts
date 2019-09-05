import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../auth/auth-guard.service';
import { SubscriptionModule } from '../subscription.module';
import { SubscriptionComponent } from '../subscription/subscription.component';
const routes: Routes = [
  {
    path: 'subscription', children: [{ path: '', component: SubscriptionComponent }],
    canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SubscriptionRoutingModule { }
