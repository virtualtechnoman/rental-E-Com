import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../shared/event-type.service';
import { Subject } from 'rxjs';
import { ResponseModel } from '../../../shared/shared.model';

@Component({
  selector: 'app-event-organizer',
  templateUrl: './event-organizer.component.html',
  styleUrls: ['./event-organizer.component.scss']
})
export class EventOrganizerComponent implements OnInit {

  jQuery:any;
  eventOrganizerForm: FormGroup;
  submitted = false;
  editing: Boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  allEventOrganizer:any[]=[];
  viewArray:any=[];
  currentEventOrganizer:any=[];
  currentEventOrganizerId:string;
  currentIndex:number

  constructor(private formBuilder: FormBuilder, private evetService:EventService, private toastr:ToastrService) {
    this.getEventOrganizers();
   }

  ngOnInit() {

    this.eventOrganizerForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobile:['', Validators.required]
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

  
  get f() { return this.eventOrganizerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.eventOrganizerForm.invalid) {
        return;
    }

    if(this.editing){
      this.updateEventOrganizer(this.eventOrganizerForm.value)
    }else{
      this.addEventOrganizer(this.eventOrganizerForm.value)
    }
    console.log(this.eventOrganizerForm.value)
}

  getEventOrganizers(){
    this.evetService.getAllEventOrganizer().subscribe((res:ResponseModel)=>{
      this.allEventOrganizer=res.data
      console.log(this.allEventOrganizer)
      this.dtTrigger.next();
    })
  }

  addEventOrganizer(state){
    this.evetService.addEventOrganizer(state).subscribe((res:ResponseModel)=>{
      console.log(res)
        jQuery('#modal3').modal('hide');
        this.toastr.success('Event Organizer Added', 'Success!');
        this.allEventOrganizer.push(res.data)
        console.log(this.allEventOrganizer)
        this.resetForm();
    })
  }
  
  viewEventOrganizer(i){
    this.viewArray=this.allEventOrganizer[i];
    console.log(this.viewArray)
  }
  
  updateEventOrganizer(event) {
    const id = this.allEventOrganizer[this.currentIndex]._id;
    // product._id = id;
    console.log(event);
    if(id)
    this.evetService.updateEventOrganizer(event, id).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.info('Event Organizer Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allEventOrganizer.splice(this.currentIndex, 1, res.data);
      this.currentEventOrganizerId = null;
      this.editing = false;
    });
  }
  
  editEventOrganizer(i){
    this.editing = true;
      this.currentEventOrganizer = this.allEventOrganizer[i];
      this.currentEventOrganizerId = this.allEventOrganizer[i]._id;
      this.currentIndex = i;
      this.setFormValue();
  
  }
  
  deleteEventOrganizer(i){
    if (confirm('You Sure you want to delete this Event Organizer')) {
      this.evetService.deleteEventOrganizer(this.allEventOrganizer[i]._id).toPromise().then(() => {
        this.toastr.warning('Event Organizer Deleted!', 'Deleted!');
        this.allEventOrganizer.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }
  
  setFormValue() {
    const event = this.allEventOrganizer[this.currentIndex];
    this.eventOrganizerForm.controls['name'].setValue(event.name);
    this.eventOrganizerForm.controls['mobile'].setValue(event.mobile);
  }
  
  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.eventOrganizerForm.reset();
    // this.initForm();
  }

}
