import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SubscriptionRoutingModule } from './shared/subscription.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    InputSwitchModule,
  ],
  declarations: [SubscriptionComponent],
  exports:[
    SubscriptionRoutingModule
  ],
  providers:[]
})
export class SubscriptionModule { }
