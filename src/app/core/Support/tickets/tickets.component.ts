import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SupportService } from '../Shared/support.service';
import { ResponseModel } from '../../../shared/shared.model';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  allTickets:any[]=[]
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  ticketsForm: FormGroup;
  submitted:boolean=false;
  editing:boolean=false;
  viewIssuesArray:any=[];
  viewMessagesArray:any[]=[];
  ticketID:string;
  textEntered:any;
  viewTotalData:any=[];
  ticketIndex:number;
  constructor(private supportService:SupportService ,private formBuilder:FormBuilder,private toastr:ToastrService) { }

  ngOnInit() {  
    this.ticketsForm = this.formBuilder.group({
      message:[''],
      issues: this.formBuilder.group({
        issue_with_previous_order: [false],
        recharge_or_tech_related_issue: [false],
        delivery_issue: [false],
        quality_issue: [false],
        timing_issue: [false],
        other: [false]
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
    this.getTickets();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.ticketsForm.invalid) {
        return;
    }
    if(this.ticketsForm.value.issues.issue_with_previous_order== null){
      this.ticketsForm.value.issues.issue_with_previous_order=false
    }
    if(this.ticketsForm.value.issues.recharge_or_tech_related_issue== null){
      this.ticketsForm.value.issues.recharge_or_tech_related_issue=false
    }
    if(this.ticketsForm.value.issues.delivery_issue== null){
      this.ticketsForm.value.issues.delivery_issue=false
    }
    if(this.ticketsForm.value.issues.quality_issue== null){
      this.ticketsForm.value.issues.quality_issue=false
    }
    if(this.ticketsForm.value.issues.timing_issue== null){
      this.ticketsForm.value.issues.timing_issue=false
    }
    if(this.ticketsForm.value.issues.other== null){
      this.ticketsForm.value.issues.other=false
    }
    
    if(this.ticketsForm.value.message== null){
      this.ticketsForm.value.message=""
    }

    const ticket =<any> new Object();
    ticket.issues=this.ticketsForm.value.issues;
    ticket.message=this.ticketsForm.value.message;
    console.log(ticket)

    this.supportService.addTicket(ticket).subscribe((res:ResponseModel)=>{
      this.allTickets.push(res.data);
      jQuery('#modal3').modal('hide');
      this.toastr.success('Ticket Added', 'Success!');
      this.resetForm();
    })

}

  getTickets(){
    this.supportService.getAllTickets().subscribe((res:ResponseModel)=>{
      this.allTickets=res.data;
      console.log(res.data)
      this.dtTrigger.next();
    })
  }

  viewTicket(i){
    this.ticketID=this.allTickets[i]._id;
    this.ticketIndex=i;
    this.supportService.getTicketInfo(this.ticketID).subscribe((res:ResponseModel)=>{
      this.viewTotalData=res.data;
      console.log(res.data)
      this.viewIssuesArray=res.data.issues
      this.viewMessagesArray=res.data.messages
      console.log(this.viewIssuesArray,this.viewMessagesArray)
    })
  }

  ticketText(event:any){
    this.textEntered=event.target.value;
  }

  sendMessage(){
    console.log(this.textEntered)
    const message=<any> new Object();
    message.message=this.textEntered;
    console.log(message)
    this.supportService.sendMessage(this.ticketID,message).subscribe((res:ResponseModel)=>{
      console.log(res.data)
      this.searchInput.nativeElement.value = '';
      this.viewMessagesArray.push(res.data.messages[res.data.messages.length-1])
    })
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.ticketsForm.reset();
    // this.initForm();
  }

}
