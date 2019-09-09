import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CustomersComponent } from './customers.component';
// import { CustomerRoutingModule } from './shared/customer.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EventTypeComponent } from './event-type/event-type.component';
import { EventRoutingModule } from './shared/even.routing';
import { EventService } from './shared/event-type.service';
import { EventOrganizerComponent } from './event-organizer/event-organizer.component';
import { MarketingMaterialComponent } from './marketing-material/marketing-material.component';
import { EventMainComponent } from './event-main/event-main.component';
import { EventLeadComponent } from './event-lead/event-lead.component';
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
  declarations: [EventTypeComponent, EventOrganizerComponent, MarketingMaterialComponent, EventMainComponent, EventLeadComponent],
  providers: [EventService],
  exports: [
    EventRoutingModule
  ]
})
export class EventModule { }