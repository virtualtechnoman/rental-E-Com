import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleComponent } from './vehicle/vehicle.component';
import { TruckRoutingModule } from './shared/truck.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TruckService } from './shared/truck.service';
import { DriverComponent } from './driver/driver.component';

@NgModule({
  imports: [
    CommonModule,
    TruckRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    InputSwitchModule
  ],
  declarations: [VehicleComponent, DriverComponent],
  providers: [TruckService],
  exports: [TruckRoutingModule]
})
export class TruckModule { }
