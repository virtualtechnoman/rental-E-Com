import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ResponseModel } from '../../../shared/shared.model';
import { LocationManagerService } from '../../location-manager/shared/location-manager.service';
import * as moment from 'moment';

@Component({
  selector: 'app-event-lead',
  templateUrl: './event-lead.component.html',
  styleUrls: ['./event-lead.component.scss']
})
export class EventLeadComponent implements OnInit {
  eventLeadForm: FormGroup;
  CommentForm: FormGroup;
  submitted = false;
  editing: Boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  viewArray: any = [];
  currentLead: any = []
  currentEventLeadId: string;
  currentLeadIndex: number;
  allLeads: any[] = []
  allCity:any[]=[]
  allMainEvents:any[]=[];
  commentEntered:any;
  genderEntered:any;
  timeFormat:any;
  showTable:boolean=false;
  leadSelectedid:any;
  leadIndex:any;
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private eventService: EventService,private locationService:LocationManagerService) { 
    this.getAllLeads()
    this.getAllCity()
    this.getAllEvents()
  }

  ngOnInit() {
    this.eventLeadForm = this.formBuilder.group({
     full_name: ['', Validators.required],
     email:  ['', Validators.required],
     contact: ['', Validators.required],
     gender:  [''],
     city:  ['', Validators.required],
     address:  ['', Validators.required],
     comments:  this.formBuilder.array([]),
     mode:  ['', Validators.required],
     event: ['', Validators.required],
     preferredTime: ['', Validators.required],

    });
    this.CommentForm=this.formBuilder.group({
      comment: ['', Validators.required],
     
    })

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
  get f() { return this.eventLeadForm.controls; }
  get f2() { return this.CommentForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.eventLeadForm.value.comments.push(this.commentEntered)
    this.eventLeadForm.value.gender=this.genderEntered
    console.log(this.eventLeadForm.value)
    // stop here if form is invalid
    if (this.eventLeadForm.invalid) {
      return;
    }

    if (this.editing) {
      // this.updateEventType(this.eventTypeForm.value)
    } else {
      this.addLead(this.eventLeadForm.value)
    }
  }

  onSubmitComment(){
    console.log(this.CommentForm.value)
    if (this.CommentForm.invalid) {
      return;
    }
    if(this.leadSelectedid)
    this.eventService.updateCommentsLead(this.CommentForm.value,this.leadSelectedid).subscribe((res:ResponseModel)=>{
      console.log(res.data)
      this.allLeads.splice(this.leadIndex,1,res.data)
      jQuery('#exampleModal').modal('hide');
      this.toastr.success('Comment Added', 'Success!');
    })
  }

  addLead(lead) {
    this.eventService.addLead(lead).subscribe((res: ResponseModel) => {
      console.log(res.data)
      jQuery('#modal3').modal('hide');
      this.toastr.success('Lead Added', 'Success!');
      this.allLeads.push(res.data)
      this.resetForm();
    })
  }

  getAllCity(){
    this.locationService.getAllCity().subscribe((res:ResponseModel)=>{
      console.log(res.data)
      this.allCity=res.data
    })
  }

  getAllEvents(){
    this.eventService.getAllMainEvent().subscribe((res: ResponseModel) => {
      this.allMainEvents = res.data;
      console.log(this.allMainEvents);
    });
  }

  getAllLeads(){
    this.eventService.getAllLeads().subscribe((res: ResponseModel) => {
      this.allLeads = res.data;
      console.log(this.allLeads);
      this.dtTrigger.next();
    });
  }

  getComments(event){
    this.commentEntered=event.target.value
  }

  genderSelection(event){
    if(event.target.value=="male"){
      this.genderEntered="male"
    }
    else if(event.target.value=="female"){
      this.genderEntered="female"
    }
  }

  viewLead(i){
    this.viewArray=this.allLeads[i]
    console.log(this.viewArray)
    this.timeFormat=moment(this.allLeads[i].preferredTime).format('LLL');
    this.leadSelectedid=this.allLeads[i]._id
    this.leadIndex=i;
    if(this.viewArray.comments.length>0){
      this.showTable=true
    }
    else{
      this.showTable=false
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.eventLeadForm.reset();
    // this.initForm();
  }

}
