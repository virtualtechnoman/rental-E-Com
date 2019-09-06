import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../../user/shared/user.model';
import { EventService } from '../shared/event-type.service';
import { ResponseModel } from '../../../shared/shared.model';
import { OrderService } from '../../order-module/shared/order.service';
import { UserService } from '../../user/shared/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-event-main',
  templateUrl: './event-main.component.html',
  styleUrls: ['./event-main.component.scss']
})
export class EventMainComponent implements OnInit {

  allEvents: any[] = [];
  allEventOrganizer: UserModel[] = [];
  allEventType: any[] = [];
  allInCharge: UserModel[] = [];
  allFarms: UserModel[] = [];
  allMarketingMaterial: any[] = [];
  currentIndex: number;
  currentEventId: string;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  eventForm: FormGroup;
  editing: Boolean = false;
  submitted: Boolean = false;
  constructor(private formBuilder: FormBuilder,
    private eventService: EventService,
    private orderService: OrderService,
    private userService: UserService,
    private toasterService: ToastrService) {
    this.initForm();
  }

  ngOnInit() {
    this.getAllEventOrganizer();
    this.getAllEventInchareg();
    this.getAllEventType();
    this.getAllFarms();
    this.getAllMarketingMaterial();
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      dom: '<"html5buttons"B>lTfgitp',
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      },
      // dom: 'Bfrtip',
      buttons: [
        // 'colvis',
        'copy',
        'print',
        'excel',
      ]
    };
  }

  initForm() {
    this.eventForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      organizer: ['', Validators.required],
      time: ['', Validators.required],
      targetLeads: ['', Validators.required],
      targetConversion: ['', Validators.required],
      incharge: ['', Validators.required],
      farm: ['', Validators.required],
      phone: ['', Validators.required],
      cost: ['', Validators.required],
      marketingMaterial: ['', Validators.required],
    });
  }

  getAllEventOrganizer() {
    this.eventService.getAllEventOrganizer().subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.error) {
        console.log('error');
      } else {
        this.allEventOrganizer = res.data;
        console.log(res);
      }
    });
  }

  getAllEventType() {
    this.eventService.getAllEvent().subscribe((res: ResponseModel) => {
      if (res.error) {
        console.log('error');
      } else {
        this.allEventType = res.data;
      }
    });
  }

  getAllEventInchareg() {
    this.userService.getAllUsers().subscribe((res: ResponseModel) => {
      if (res.error) {
        console.log('error');
      } else {
        this.allInCharge = res.data;
      }
    });
  }

  getAllMarketingMaterial() {
    this.eventService.getAllMarketingMaterial().subscribe((res: ResponseModel) => {
      if (res.error) {
        console.log('error');
      } else {
        this.allMarketingMaterial = res.data;
      }
    });

  }

  getAllFarms() {
    this.orderService.getAllFarms().subscribe((res: ResponseModel) => {
      if (res.error) {
        console.log('error');
      } else {
        this.allFarms = res.data;
      }
    });
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.eventForm.reset();
  }

  get f() { return this.eventForm.controls; }

  onSubmit() {
    console.log(this.eventForm.value);
    this.submitted = true;
    if (this.eventForm.invalid) {
      return;
    }
    if (this.editing) {
      this.updateEvent(this.eventForm.value);
    } else {
      this.addEvent(this.eventForm.value);
    }
  }

  addEvent(event) {
    this.eventService.addEvent(event).subscribe((res: ResponseModel) => {
      console.log(res.data)
      jQuery('#modal3').modal('hide');
      this.toasterService.success('State Added', 'Success!');
      this.allEvents.push(res.data);
      this.resetForm();
    });
  }

  updateEvent(event) {
    const id = this.allEvents[this.currentIndex]._id;
    if (id) {
      this.eventService.updateEvent(event, id).subscribe((res: ResponseModel) => {
        jQuery('#modal3').modal('hide');
        this.toasterService.info('State Updated Successfully!', 'Updated!!');
        this.resetForm();
        this.allEvents.splice(this.currentIndex, 1, res.data);
        this.currentEventId = null;
        this.editing = false;
      });
    }
  }
}
