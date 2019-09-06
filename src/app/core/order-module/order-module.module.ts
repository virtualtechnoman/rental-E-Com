import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnOrderComponent } from './return-order/return-order.component';
import { ChallanComponent } from './challan/challan.component';
import { OrderComponent } from './order/order.component';
import { OrderRoutingModule } from './shared/order.routing';
import { OrderService } from './shared/order.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ReturnorderchallanComponent } from './returnorderchallan/returnorderchallan.component';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    InputSwitchModule,
  ],
  declarations: [ReturnOrderComponent, ChallanComponent, OrderComponent, ReturnorderchallanComponent],
  providers: [OrderService],
  exports: [OrderRoutingModule]
})

export class OrderModuleModule { }
