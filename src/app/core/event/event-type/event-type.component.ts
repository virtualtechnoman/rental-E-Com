import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../shared/event-type.service';
import { ResponseModel } from '../../../shared/shared.model';

@Component({
  selector: 'app-event-type',
  templateUrl: './event-type.component.html',
  styleUrls: ['./event-type.component.scss']
})
export class EventTypeComponent implements OnInit {
  eventTypeForm: FormGroup;
  submitted = false;
  editing: Boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  viewArray: any = [];
  currentEvent: any = []
  currentEventTypeId: string;
  currentIndex: number;
  allEventTypes: any[] = []

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private eventService: EventService) {

    this.getEventTypes();
  }

  ngOnInit() {
    this.eventTypeForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
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


  get f() { return this.eventTypeForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.eventTypeForm.invalid) {
      return;
    }

    if (this.editing) {
      this.updateEventType(this.eventTypeForm.value)
    } else {
      this.addEventType(this.eventTypeForm.value)
    }
  }

  addEventType(event) {
    this.eventService.addEvent(event).subscribe((res: ResponseModel) => {
      console.log(res.data)
      jQuery('#modal3').modal('hide');
      this.toastr.success('State Added', 'Success!');
      this.allEventTypes.push(res.data)
      this.resetForm();
    })
  }

  updateEventType(event) {
    const id = this.allEventTypes[this.currentIndex]._id;
    // product._id = id;
    console.log(event);
    if (id) {
      this.eventService.updateEvent(event, id).subscribe((res: ResponseModel) => {
        jQuery('#modal3').modal('hide');
        this.toastr.info('State Updated Successfully!', 'Updated!!');
        this.resetForm();
        this.allEventTypes.splice(this.currentIndex, 1, res.data);
        this.currentEventTypeId = null;
        this.editing = false;
      });
    }
  }

  viewEventType(i) {
    this.viewArray = this.allEventTypes[i];
    console.log(this.viewArray);
  }

  editEventType(i) {
    this.editing = true;
    this.currentEvent = this.allEventTypes[i];
    this.currentEventTypeId = this.allEventTypes[i]._id;
    this.currentIndex = i;
    this.setFormValue();

  }
  deleteEvent(i) {
    if (confirm('You Sure you want to delete this Event Type')) {
      this.eventService.deleteEvent(this.allEventTypes[i]._id).toPromise().then(() => {
        this.toastr.warning('Event Deleted!', 'Deleted!');
        this.allEventTypes.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  setFormValue() {
    const event = this.allEventTypes[this.currentIndex];
    this.eventTypeForm.controls['name'].setValue(event.name);
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.eventTypeForm.reset();
    // this.initForm();
  }

  getEventTypes() {
    this.eventService.getAllEvent().subscribe((res: ResponseModel) => {
      this.allEventTypes = res.data;
      console.log(this.allEventTypes);
      this.dtTrigger.next();
    });
  }

}
