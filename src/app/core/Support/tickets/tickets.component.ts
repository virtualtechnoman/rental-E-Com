import { Component, OnInit } from '@angular/core';
import { SupportService } from '../Shared/support.service';
import { ResponseModel } from '../../../shared/shared.model';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  allTickets:any[]=[]
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  ticketsForm: FormGroup;
  submitted:boolean=false;
  editing:boolean=false;
  constructor(private supportService:SupportService ,private formBuilder:FormBuilder) { }

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
    console.log(this.ticketsForm)
}

  getTickets(){
    this.supportService.getAllTickets().subscribe((res:ResponseModel)=>{
      this.allTickets=res.data;
      console.log(res.data)
      this.dtTrigger.next();
    })
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.ticketsForm.reset();
    // this.initForm();
  }

}
