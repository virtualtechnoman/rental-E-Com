import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { SupportService } from '../Shared/support.service';
import { ResponseModel } from '../../../shared/shared.model';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user/shared/user-service.service';
import { CustomersService } from '../../customers/shared/customers.service';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChildren("radio") radio1: any;
  @ViewChildren("radio2") radio2: any;
  @ViewChildren("radio3") radio3: any;
  @ViewChildren("radio4") radio4: any;
  allTickets:any[]=[]
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  ticketsForm: FormGroup;
  followUpForm: FormGroup;
  submitted:boolean=false;
  editing:boolean=false;
  viewIssuesArray:any=[];
  viewMessagesArray:any[]=[];
  ticketID:string;
  textEntered:any;
  viewTotalData:any=[];
  ticketIndex:number;
  showCard:boolean=false;
  name:string="";
  showProductConcern:boolean=false;
  showServiceConcern:boolean=false;
  showCloseSubscription:boolean=false;
  showCard2:boolean=false;
  allUsers:any[]=[]
  allCustomers:any[]=[];
  viewArray:any=[]
  currenTicketId: any;
  currentIndex: any;
  callType:any;
  customerConcernMedia:any;
  Products:any;
  showTicketPructProblem:boolean=false;
  showTicketServiceProblem:boolean=false;
  showTicketSubscriptionProblem:boolean=false;
  showResponses:boolean=false;
  constructor(private supportService:SupportService ,private formBuilder:FormBuilder,private toastr:ToastrService,private userService:UserService,private customerService:CustomersService) { }

  ngOnInit() {  
    
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
    this.followUpForm=this.formBuilder.group({
      followUpComments:[''],
      actionTaken:['']
    })
    this.ticketsForm=this.formBuilder.group({
      customer:[''],
      customerConcern:[''],
      assignTo:[''],
      isUrgent:[false],
      isSubscriptionClosed:[false],
      callType:this.formBuilder.group({
        inbound:[false],
        outbound:[false]
      }),
      customerConcernMedia:this.formBuilder.group({
        mobile:[false],
        whatsapp:[false],
        hub:[false]
      }),
      products:this.formBuilder.group({
        milk: [false],
        ghee: [false],
        butter: [false],
        cheese: [false],
      }),
        milkComposition:this.formBuilder.group({ 
        thinMilklessFat:[false] ,
        thickMilkMoreFat:[false] ,
    }),
    impuritiesInMilk:this.formBuilder.group({ 
      insectInMilk:[false] ,
      siltInMilk:[false] ,
      blackParticle:[false] ,

    }),
    packaging:this.formBuilder.group({ 
      bottleBrokeOrChipped:[false] ,
      sealBroken:[false] ,
      dirtyCaps:[false] ,
      noDCPLabel:[false] ,
  }),
  propertiesOfMilk:this.formBuilder.group({ 
    offSmell:[false] ,
    offTaste:[false] ,
    curdlingOfMilk:[false] ,
    noProperCurd:[false] ,
    notYellowInColor:[false] ,
    stickingToUtensilOnBoiling:[false] ,
}),
deliverySchedule:this.formBuilder.group({ 
  noDelivery:[false] ,
  deliveredWithoutSubscription:[false] ,
  wrongQuantityDelivered:[false] ,
}),
deliveryTiming:this.formBuilder.group({ 
  deliveringLate:[false] ,
  deliveringEarly:[false] ,
  irregularDeliveryTime:[false] ,
}),

billingIssue:this.formBuilder.group({ 
  paidAlready:[false] ,
  wronglyBilledOnNonDeliveryDates:[false] ,
}),

serviceIssue:this.formBuilder.group({ 
  notFollowedUpRaisedConcern:[false] ,
  notFollowedDeliveryInstruction:[false] ,
  didNotStartSubscriptionAsPromised:[false] ,
}),
closeSubscriptionRequest:this.formBuilder.group({
  
  relocated:[false] ,
  costly:[false] ,
  wantA2Milk:[false] ,
  timingIssue:[false] ,
  milkCompositionIssue:[false] ,
  billingIssue:[false] ,
  healthIssue:[false] ,
  otherBrand:[false] ,
  localVendor:[false] ,
  wantBuffaloMilk:[false] ,
  noReason:[false] ,
  doctorAdvice:[false] ,
  lessConsumption:[false] ,
})
  })

    this.getTickets();
    this.getUsers();
    this.getCustomer();
  }
  
  get f() { return this.ticketsForm.controls; }
  get f2() { return this.followUpForm.controls; }

  getCustomer(){
    this.customerService.getAllCustomers().subscribe((res:ResponseModel)=>{
      this.allCustomers=res.data
      console.log(this.allCustomers)
    })
  }

  getUsers(){
    this.userService.getAllUsers().subscribe((res:ResponseModel)=>{
      this.allUsers=res.data;
      console.log(this.allUsers)
    })
  }

  onSubmitFollowUpForm(){
    console.log(this.followUpForm.value)
    this.supportService.sendTicketFollowUp(this.allTickets[this.currentIndex]._id,this.followUpForm.value).subscribe((res:ResponseModel)=>{
      this.allTickets.splice(this.currentIndex,1,res.data)
      this.toastr.info('Follow up is successfull!', 'Succcess!!');
      jQuery('#ticketModal').modal('hide');
      console.log(res.data)
    })
  }

  selectustomerConcernMedia(event){
    if(event.target.value=="1"){
      this.ticketsForm.value.customerConcernMedia.mobile=true;
      this.ticketsForm.value.customerConcernMedia.whatsapp=false;
      this.ticketsForm.value.customerConcernMedia.hub=false;
    }
    else if(event.target.value=="2"){
      this.ticketsForm.value.customerConcernMedia.mobile=false;
      this.ticketsForm.value.customerConcernMedia.whatsapp=true;
      this.ticketsForm.value.customerConcernMedia.hub=false;
    }
    else if(event.target.value=="3"){
      this.ticketsForm.value.customerConcernMedia.mobile=false;
      this.ticketsForm.value.customerConcernMedia.whatsapp=false;
      this.ticketsForm.value.customerConcernMedia.hub=true;
    }
  }

  selectustomerProducts(event){

    // milk: [false],
    //     ghee: [false],
    //     butter: [false],
    //     cheese: [false],

    if(event.target.value=="1"){
      this.ticketsForm.value.products.milk=true;
      this.ticketsForm.value.products.ghee=false;
      this.ticketsForm.value.products.butter=false;
      this.ticketsForm.value.products.cheese=false;
    }
    else if(event.target.value=="2"){
      this.ticketsForm.value.products.milk=false;
      this.ticketsForm.value.products.ghee=true;
      this.ticketsForm.value.products.butter=false;
      this.ticketsForm.value.products.cheese=false;
    }
    else if(event.target.value=="3"){
      this.ticketsForm.value.products.milk=false;
      this.ticketsForm.value.products.ghee=false;
      this.ticketsForm.value.products.butter=true;
      this.ticketsForm.value.products.cheese=false;
    }
    else if(event.target.value=="4"){
      this.ticketsForm.value.products.milk=false;
      this.ticketsForm.value.products.ghee=false;
      this.ticketsForm.value.products.butter=false;
      this.ticketsForm.value.products.cheese=true;
    }
  }

  onSubmit(){
    console.log(this.radio1)
    if(this.radio1._results[0].nativeElement.checked==true){
    this.ticketsForm.value.callType.inbound=true
    this.ticketsForm.value.callType.outbound=false
    }else{
      this.ticketsForm.value.callType.inbound=false
      this.ticketsForm.value.callType.outbound=true
    }
    


    this.ticketsForm.value.customerConcernMedia.mobile=Boolean(this.ticketsForm.value.customerConcernMedia.mobile)
    this.ticketsForm.value.customerConcernMedia.whatsapp=Boolean(this.ticketsForm.value.customerConcernMedia.whatsapp)
    this.ticketsForm.value.customerConcernMedia.hub=Boolean(this.ticketsForm.value.customerConcernMedia.hub)

    this.ticketsForm.value.products.milk=Boolean(this.ticketsForm.value.products.milk)
    this.ticketsForm.value.products.ghee=Boolean(this.ticketsForm.value.products.ghee)
    this.ticketsForm.value.products.butter=Boolean(this.ticketsForm.value.products.butter)
    this.ticketsForm.value.products.cheese=Boolean(this.ticketsForm.value.products.cheese)

    this.ticketsForm.value.milkComposition.thinMilklessFat=Boolean(this.ticketsForm.value.milkComposition.thinMilklessFat)
    this.ticketsForm.value.milkComposition.thickMilkMoreFat=Boolean(this.ticketsForm.value.milkComposition.thickMilkMoreFat)

    this.ticketsForm.value.impuritiesInMilk.insectInMilk=Boolean(this.ticketsForm.value.impuritiesInMilk.insectInMilk)
    this.ticketsForm.value.impuritiesInMilk.siltInMilk=Boolean(this.ticketsForm.value.impuritiesInMilk.siltInMilk)
    this.ticketsForm.value.impuritiesInMilk.blackParticle=Boolean(this.ticketsForm.value.impuritiesInMilk.blackParticle)
    this.ticketsForm.value.packaging.bottleBrokeOrChipped=Boolean(this.ticketsForm.value.packaging.bottleBrokeOrChipped)

    this.ticketsForm.value.packaging.sealBroken=Boolean(this.ticketsForm.value.packaging.sealBroken)
    this.ticketsForm.value.packaging.dirtyCaps=Boolean(this.ticketsForm.value.packaging.dirtyCaps)
    this.ticketsForm.value.packaging.noDCPLabel=Boolean(this.ticketsForm.value.packaging.noDCPLabel)
    this.ticketsForm.value.propertiesOfMilk.offSmell=Boolean(this.ticketsForm.value.propertiesOfMilk.offSmell)
    this.ticketsForm.value.propertiesOfMilk.offTaste=Boolean(this.ticketsForm.value.propertiesOfMilk.offTaste)
    this.ticketsForm.value.propertiesOfMilk.curdlingOfMilk=Boolean(this.ticketsForm.value.propertiesOfMilk.curdlingOfMilk)
    this.ticketsForm.value.propertiesOfMilk.noProperCurd=Boolean(this.ticketsForm.value.propertiesOfMilk.noProperCurd)
    this.ticketsForm.value.propertiesOfMilk.notYellowInColor=Boolean(this.ticketsForm.value.propertiesOfMilk.notYellowInColor)
    this.ticketsForm.value.propertiesOfMilk.stickingToUtensilOnBoiling=Boolean(this.ticketsForm.value.propertiesOfMilk.stickingToUtensilOnBoiling)

    // Service concern
    
    this.ticketsForm.value.deliverySchedule.noDelivery=Boolean(this.ticketsForm.value.deliverySchedule.noDelivery)
    this.ticketsForm.value.deliverySchedule.deliveredWithoutSubscription=Boolean(this.ticketsForm.value.deliverySchedule.deliveredWithoutSubscription)
    this.ticketsForm.value.deliverySchedule.wrongQuantityDelivered=Boolean(this.ticketsForm.value.deliverySchedule.wrongQuantityDelivered)

    
    this.ticketsForm.value.deliveryTiming.deliveringLate=Boolean(this.ticketsForm.value.deliveryTiming.deliveringLate)
    this.ticketsForm.value.deliveryTiming.deliveringEarly=Boolean(this.ticketsForm.value.deliveryTiming.deliveringEarly)
    this.ticketsForm.value.deliveryTiming.irregularDeliveryTime=Boolean(this.ticketsForm.value.deliveryTiming.irregularDeliveryTime)

    
    this.ticketsForm.value.billingIssue.paidAlready=Boolean(this.ticketsForm.value.billingIssue.paidAlready)
    this.ticketsForm.value.billingIssue.wronglyBilledOnNonDeliveryDates=Boolean(this.ticketsForm.value.billingIssue.wronglyBilledOnNonDeliveryDates)

    
    this.ticketsForm.value.serviceIssue.notFollowedUpRaisedConcern=Boolean(this.ticketsForm.value.serviceIssue.notFollowedUpRaisedConcern)
    this.ticketsForm.value.serviceIssue.notFollowedDeliveryInstruction=Boolean(this.ticketsForm.value.serviceIssue.notFollowedDeliveryInstruction)
    this.ticketsForm.value.serviceIssue.didNotStartSubscriptionAsPromised=Boolean(this.ticketsForm.value.serviceIssue.didNotStartSubscriptionAsPromised)


    // Closed Subscription
    this.ticketsForm.value.closeSubscriptionRequest.relocated=Boolean(this.ticketsForm.value.closeSubscriptionRequest.relocated)
    this.ticketsForm.value.closeSubscriptionRequest.costly=Boolean(this.ticketsForm.value.closeSubscriptionRequest.costly)
    this.ticketsForm.value.closeSubscriptionRequest.wantA2Milk=Boolean(this.ticketsForm.value.closeSubscriptionRequest.wantA2Milk)
    this.ticketsForm.value.closeSubscriptionRequest.timingIssue=Boolean(this.ticketsForm.value.closeSubscriptionRequest.timingIssue)
    this.ticketsForm.value.closeSubscriptionRequest.milkCompositionIssue=Boolean(this.ticketsForm.value.closeSubscriptionRequest.milkCompositionIssue)
    this.ticketsForm.value.closeSubscriptionRequest.billingIssue=Boolean(this.ticketsForm.value.closeSubscriptionRequest.billingIssue)
    this.ticketsForm.value.closeSubscriptionRequest.healthIssue=Boolean(this.ticketsForm.value.closeSubscriptionRequest.healthIssue)
    this.ticketsForm.value.closeSubscriptionRequest.otherBrand=Boolean(this.ticketsForm.value.closeSubscriptionRequest.otherBrand)
    this.ticketsForm.value.closeSubscriptionRequest.localVendor=Boolean(this.ticketsForm.value.closeSubscriptionRequest.localVendor)
    this.ticketsForm.value.closeSubscriptionRequest.wantBuffaloMilk=Boolean(this.ticketsForm.value.closeSubscriptionRequest.wantBuffaloMilk)
    this.ticketsForm.value.closeSubscriptionRequest.noReason=Boolean(this.ticketsForm.value.closeSubscriptionRequest.noReason)
    this.ticketsForm.value.closeSubscriptionRequest.doctorAdvice=Boolean(this.ticketsForm.value.closeSubscriptionRequest.doctorAdvice)
    this.ticketsForm.value.closeSubscriptionRequest.lessConsumption=Boolean(this.ticketsForm.value.closeSubscriptionRequest.lessConsumption)

    // isSubscriptionClosed and isUrgent

    this.ticketsForm.value.isSubscriptionClosed=Boolean(this.ticketsForm.value.isSubscriptionClosed)
    this.ticketsForm.value.isUrgent=Boolean(this.ticketsForm.value.isUrgent)
    console.log(this.ticketsForm.value)
    const ticket=<any> new Object();
    ticket['issues'] = {};
    ticket['callType'] = {};
    ticket['customerConcernMedia'] = {};
    ticket['products'] = {};
    ticket['issues']['productConcern']={
      milkComposition:this.ticketsForm.value.milkComposition,
      impuritiesInMilk:this.ticketsForm.value.impuritiesInMilk,
      packaging:this.ticketsForm.value.packaging,
      propertiesOfMilk:this.ticketsForm.value.propertiesOfMilk
    }
    ticket['issues']['serviceConcern']={
      deliverySchedule:this.ticketsForm.value.deliverySchedule,
      serviceIssue:this.ticketsForm.value.serviceIssue,
      deliveryTiming:this.ticketsForm.value.deliveryTiming,
      billingIssue:this.ticketsForm.value.billingIssue
    }
    ticket['issues']['closeSubscriptionRequest']=this.ticketsForm.value.closeSubscriptionRequest
    ticket['customer']=this.ticketsForm.value.customer
    ticket['customerConcern']=this.ticketsForm.value.customerConcern
    ticket['assignTo']=this.ticketsForm.value.assignTo
    ticket['isUrgent']=this.ticketsForm.value.isUrgent
    ticket['isSubscriptionClosed']=this.ticketsForm.value.isSubscriptionClosed
    ticket['callType']={
      inbound:this.ticketsForm.value.callType.inbound,
      outbound:this.ticketsForm.value.callType.outbound
    }
    ticket['customerConcernMedia']={
      mobile:this.ticketsForm.value.customerConcernMedia.mobile,
      whatsapp:this.ticketsForm.value.customerConcernMedia.whatsapp,
      hub:this.ticketsForm.value.customerConcernMedia.hub
    }
    ticket['products']={
      milk:this.ticketsForm.value.products.milk,
      ghee:this.ticketsForm.value.products.ghee,
      butter:this.ticketsForm.value.products.butter,
      cheese:this.ticketsForm.value.products.cheese
    }

    console.log(ticket)
    this.supportService.addTicket(ticket).subscribe((res:ResponseModel)=>{
      this.allTickets.push(res.data)
      console.log(res.data)
      this.toastr.info('Ticket Has Been Generated Successfully!', 'Generated!!');
      jQuery('#modal3').modal('hide');
    })
   
  }


  getTickets(){
    this.supportService.getAllTickets().subscribe((res:ResponseModel)=>{
      this.allTickets=res.data;
      console.log(res.data)
      this.dtTrigger.next();
    })
  }


  resetForm() {
    console.log(this.ticketsForm)
    this.editing = false;
    this.submitted = false;
    this.showProductConcern=true;
    this.showServiceConcern=false;
    this.showCloseSubscription=false;
    this.ticketsForm.reset();
  }

products(){
  this.showProductConcern=true;
  this.showServiceConcern=false;
  this.showCloseSubscription=false;
}
service(){
  
  this.showProductConcern=false;
  this.showServiceConcern=true;
  this.showCloseSubscription=false;
}

subscription(){
  this.showProductConcern=false;
  this.showServiceConcern=false;
  this.showCloseSubscription=true;
}

showTicketProductConcern(){
  this.showTicketPructProblem=true;
  this.showTicketServiceProblem=false;
  this.showTicketSubscriptionProblem=false;
}

showTicketServiceConcern(){
  this.showTicketPructProblem=false;
  this.showTicketServiceProblem=true;
  this.showTicketSubscriptionProblem=false;
}

showTicketSubscriptionConcern(){
this.showTicketSubscriptionProblem=true;
this.showTicketPructProblem=false;
  this.showTicketServiceProblem=false;
}

viewTicket(i){
  this.showTicketPructProblem=true;
  this.showTicketServiceProblem=false;
  this.showTicketSubscriptionProblem=false;
  this.viewArray=this.allTickets[i]
  console.log(this.viewArray)
  this.editing=true;
    this.currenTicketId = this.allTickets[i]._id;
    this.currentIndex = i;
    if(this.viewArray.callType.inbound==true){
      this.callType="inbound"
    }
    else{
      this.callType="inbound"
    }

    if(this.viewArray.customerConcernMedia.hub==true){
      this.customerConcernMedia="hub"
    }
    else if(this.viewArray.customerConcernMedia.mobile==true){
      this.customerConcernMedia="mobile"
    }
    else{
      this.customerConcernMedia="whatsapp"
    }

    if(this.viewArray.products.butter==true){
      this.Products="butter"
    }
    else if(this.viewArray.products.cheese==true){
      this.Products="cheese"
    }
    else if(this.viewArray.products.ghee==true){
      this.Products="ghee"
    }
    else{
      this.Products="milk"
    }

    if(this.viewArray.responses.length>0){
      this.showResponses=true
    }
    else{
      this.showResponses=false
    }
}

}
