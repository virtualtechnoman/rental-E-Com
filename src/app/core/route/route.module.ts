import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CustomersComponent } from './customers.component';
// import { CustomerRoutingModule } from './shared/customer.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RouteComponent } from './route/route.component';
import { RouteRoutingModule } from './shared/route.routing';
import { RouteService } from './shared/route.service';
import { CustomerRouteManagementComponent } from './customer-route-management/customer-route-management.component';
// import { DistirbutorComponent } from './distirbutor/distirbutor.component';
// import { SectorComponent } from './sector/sector.component';

@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule
  ],
  declarations: [RouteComponent, CustomerRouteManagementComponent],
  providers: [RouteService],
  exports: [
    RouteRoutingModule
  ]
})
export class RouteModule { }