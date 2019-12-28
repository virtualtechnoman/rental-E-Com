import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CustomersComponent } from './customers.component';
// import { CustomerRoutingModule } from './shared/customer.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { InputSwitchModule } from 'primeng/inputswitch';
import { LocationRoutingModule } from './shared/location.routing';
import { StateComponent } from './state/state.component';
import { LocationManagerService } from './shared/location-manager.service';
import { CityComponent } from './city/city.component';
import { AreaComponent } from './area/area.component';
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
  declarations: [StateComponent, CityComponent, AreaComponent],
  providers: [LocationManagerService],
  exports: [
    LocationRoutingModule
  ]
})
export class LocationManagerModule { }