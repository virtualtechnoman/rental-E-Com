import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { CustomerRoutingModule } from './shared/customer.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DistirbutorComponent } from './distirbutor/distirbutor.component';
import { SectorComponent } from './sector/sector.component';
import { OrderComponent } from './order/order.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!

@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule,
    FullCalendarModule
  ],
  declarations: [CustomersComponent, DistirbutorComponent, SectorComponent, OrderComponent],
  exports: [
    CustomerRoutingModule
  ]
})
export class CustomersModule { }
