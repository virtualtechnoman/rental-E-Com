import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EventService } from '../shared/event-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, observable } from 'rxjs';
import { ResponseModel } from '../../../shared/shared.model';
import { LocationManagerService } from '../../location-manager/shared/location-manager.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-lead',
  templateUrl: './event-lead.component.html',
  styleUrls: ['./event-lead.component.scss']
})
export class EventLeadComponent implements OnInit {
  eventLeadForm: FormGroup;
  CommentForm: FormGroup;
  StatusForm: FormGroup;
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
  @ViewChild('myInput') myInputVariable: ElementRef;
  @ViewChild('myInput2') myInputVariable2: ElementRef;
  constructor(private router:Router,private formBuilder: FormBuilder, private toastr: ToastrService, private eventService: EventService,private locationService:LocationManagerService) { 
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
     comment:  ['', Validators.required],
     mode:  ['', Validators.required],
     event: ['', Validators.required],
     preferredTime: ['', Validators.required],
     status:['',Validators.required],
     nextdate:['',Validators.required],
     callStatus:['',Validators.required]
    });
    this.CommentForm=this.formBuilder.group({
      comment: ['', Validators.required],
      nextdate:['',Validators.required],
      StatusForm:this.formBuilder.group({
        status: [''],
        callStatus: [''],
      })
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
    this.eventLeadForm.value.gender=this.genderEntered
    console.log(this.eventLeadForm.value)

    const lead=<any> new Object();
    lead.comments={}
    lead.address=this.eventLeadForm.value.address
    lead.city=this.eventLeadForm.value.city
    lead.contact=this.eventLeadForm.value.contact
    lead.email=this.eventLeadForm.value.email
    lead.event=this.eventLeadForm.value.event
    lead.full_name=this.eventLeadForm.value.full_name
    lead.gender=this.eventLeadForm.value.gender
    lead.mode=this.eventLeadForm.value.mode
    lead.preferredTime=this.eventLeadForm.value.preferredTime
    lead.comments.comment=this.eventLeadForm.value.comment
    lead.comments.nextDate=this.eventLeadForm.value.nextdate
    lead.status=this.eventLeadForm.value.status
    lead.callStatus=this.eventLeadForm.value.callStatus
    // stop here if form is invalid
    if (this.eventLeadForm.invalid) {
      return;
    }

    if (this.editing) {
      // this.updateEventType(this.eventTypeForm.value)
    } else {
      this.addLead(lead)
    }
  }

  onSubmitComment(){
    console.log(this.CommentForm.value)
    if (this.CommentForm.invalid) {
      return;
    }
    const comments=<any> new Object();
    comments.comments={}
    comments.comments.comment=this.CommentForm.value.comment
    comments.comments.nextDate=this.CommentForm.value.nextdate
    comments.status=this.CommentForm.value.StatusForm.status
    comments.callStatus=this.CommentForm.value.StatusForm.callStatus
    console.log(comments)
    if(this.leadSelectedid)
    this.eventService.updateCommentsLead(comments,this.leadSelectedid).subscribe((res:ResponseModel)=>{
      console.log(res.data)
      this.allLeads.splice(this.leadIndex,1,res.data)
      jQuery('#exampleModal').modal('hide');
      this.toastr.success('Comment Added', 'Success!');
      this.myInputVariable.nativeElement.value = "";
      this.CommentForm.reset();
      
    })
  }

  addLead(lead) {
    console.log(lead);
    
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
    this.CommentForm.controls['StatusForm'].get('status').setValue(this.viewArray.status)
    this.CommentForm.controls['StatusForm'].get('callStatus').setValue(this.viewArray.callStatus)
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.eventLeadForm.reset();
    // this.initForm();
  }

  navigateToEvent(){
    this.router.navigate(['/eventmain'])
  }

}
