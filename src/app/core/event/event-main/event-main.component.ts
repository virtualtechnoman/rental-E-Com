import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserModel } from '../../user/shared/user.model';
import { EventService } from '../shared/event-type.service';
import { ResponseModel } from '../../../shared/shared.model';
import { OrderService } from '../../order-module/shared/order.service';
import { UserService } from '../../user/shared/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ProductsService } from '../../products/shared/products.service';
import * as moment from 'moment';
import { LocationManagerService } from '../../location-manager/shared/location-manager.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-event-main',
  templateUrl: './event-main.component.html',
  styleUrls: ['./event-main.component.scss']
})
export class EventMainComponent implements OnInit {
  allCities: any[] = [];
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
  CommentForm: FormGroup;
  editing: Boolean = false;
  submitted: Boolean = false;
  allproducts: any[] = [];
  allHubs: any[] = [];
  selectedDate: any;
  selectedTime: any;
  mainEvent: any[] = [];
  mainEvent2: any[] = [];
  allFormIncharge: any[] = [];
  viewArray: any[] = [];
  timeFormat: any;
  mainEventId: any;
  mainEventIndex: any;
  status: any;
  cuurentEventEdit: any;
  currentIndexEdit: number;
  currentEventIdEdit: any;
  editAddInchargeArray: any = [];
  editAddProductsArray: any = [];
  editMarketingMaterialArray: any = [];
  selectedDateAddEvent: any;
  selectedDateEdit: string;
  pendingCallsLeads: any []= []
  pendingCallsLeads2: any[] = []
  convertedCallsLeads: any[]= []
  convertedCallsLeads2: any[] = [];
  leadStatus:any;
  callingStatus:any;
  callingStatusLeads:any[]=[]
  showCallingStatusLeads:boolean=false;
  showLeadStatusLeads:boolean=false;
  leadStatusLeads:any[]=[];
  leadViewingByLeadStatus:any=[]
  leadSelectedid: any;
  leadIndex: any;
  showTable:boolean=false
  showleadViewingByLeadStatus:boolean=false
  leadViewingByLeadCallStatus:any=[]
  showleadViewingByLeadCommentStatus:boolean=false;
  callPendindView:any;
  leadslength:any;
  conversionLeangth:any;
  pendingLength:any;
  specificEventRecords:any[]=[]
  viewSpecificEventRecords:any[]=[]
  showSpecificEventRecords:boolean=false
  @ViewChild('myInput') myInputVariable: ElementRef;
  @ViewChild('myInput2') myInputVariable2: ElementRef;
  constructor(private formBuilder: FormBuilder,
    private eventService: EventService,
    private orderService: OrderService,
    private userService: UserService,
    private toasterService: ToastrService,
    private productService: ProductsService,
    private router:Router,
    private locationService: LocationManagerService) {
    this.initForm();
  }

  ngOnInit() {
    this.getAllEventOrganizer();
    this.getAllEventInchareg();
    this.getAllEventType();
    this.getAllFarms();
    this.getProducts();
    this.getHubs();
    this.getAllMarketingMaterial();
    this.getAllMainEvents();
    this.getCity();
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
    this.CommentForm=this.formBuilder.group({
      comment: ['', Validators.required],
      nextdate:['',Validators.required],
      StatusForm:this.formBuilder.group({
        status: [''],
        callStatus: [''],
      })
    })
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
      incharge: this.formBuilder.array([]),
      farm: ['', Validators.required],
      phone: ['', Validators.required],
      cost: ['', Validators.required],
      marketingMaterial: this.formBuilder.array([]),
      products: this.formBuilder.array([]),
      status: ['', Validators.required],
      hub: ['', Validators.required]
    });
  }
  get MaterialForms() {
    return this.eventForm.get('marketingMaterial') as FormArray
  }

  addMaterial() {

    const material = this.formBuilder.group({
      material: [],
      quantity: []
    })

    this.MaterialForms.push(material);
  }

  deleteMaterial(i) {
    this.MaterialForms.removeAt(i)
  }

  get InchargeForm() {
    return this.eventForm.get('incharge') as FormArray
  }

  addIncharge() {

    const incharge = this.formBuilder.group({
      incharge: []
    })
    this.InchargeForm.push(incharge);
  }

  deleteIncharge(i) {
    this.InchargeForm.removeAt(i)
  }

  get productsForms() {

    return this.eventForm.get('products') as FormArray;

  }


  addProducts() {

    const product = this.formBuilder.group({
      product: [],
      quantity: []
    })

    this.productsForms.push(product);
  }



  deleteProducts(i) {
    this.productsForms.removeAt(i)
  }

  getProducts() {
    this.allproducts.length = 0;
    this.productService.getAllProduct().subscribe((res: ResponseModel) => {
      this.allproducts = res.data;
    });
  }

  getAllMainEvents() {
    this.eventService.getAllMainEvent().subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.errors) {
        console.log('error');
      } else {
        
        this.mainEvent = res.data;
        this.mainEvent2 = res.data;
        if (res.data)
        console.log(res.data);

        for (var i = 0; i < res.data.length; i++) {
          var leadscount = 0;
          var convertedcount = 0;
          if (res.data[i].leads) {
            for (var j = 0; j < res.data[i].leads.length; j++) {
              console.log(res.data[i].leads[j]);
              if(res.data[i].leads[j])
              if (res.data[i].leads[j].callStatus == 'pending') {
                leadscount = leadscount + 1
                console.log("pending");
              }
              else if (res.data[i].leads[j].callStatus == 'compleated') {
                convertedcount = convertedcount + 1
                console.log("compleated");
              }
            }
            this.pendingCallsLeads[i]=leadscount
            this.convertedCallsLeads[i]=convertedcount
          }
          else{
            this.pendingCallsLeads[i]=0
            this.convertedCallsLeads[i]=0
          }

        }
        console.log(this.pendingCallsLeads, this.convertedCallsLeads);
      }
      this.dtTrigger.next()
    });
  }

  getAllEventsNavBar() {
    this.mainEvent.length = 0
    this.mainEvent = this.mainEvent2
  }

  getAllEventsByCity(event) {
    console.log(event.target.selectedIndex)
    this.eventService.getAllMainEventByCity(this.allCities[event.target.selectedIndex - 1]._id).subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.errors) {
        console.log('error');
      } else {
        this.mainEvent = res.data;
        console.log(res);
      }
    });

  }

  getAllEventsByEventType(event) {
    console.log(event.target.selectedIndex);
    this.eventService.getAllMainEventByEventType(this.allEventType[event.target.selectedIndex - 1]._id).subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.errors) {
        console.log('error');
      } else {
        this.mainEvent = res.data;
        console.log(res);
      }
    });

  }

  getCity() {
    this.locationService.getAllCity().subscribe((res: ResponseModel) => {
      this.allCities = res.data
      console.log(this.allCities)
      this.dtTrigger.next();
    })
  }


  getAllEventOrganizer() {
    this.eventService.getAllEventOrganizer().subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.errors) {
        console.log('error');
      } else {
        this.allEventOrganizer = res.data;
        console.log(res);
      }
    });
  }

  getHubs() {
    this.productService.getAllHub().subscribe((res: ResponseModel) => {
      this.allHubs = res.data;
    });
  }

  getAllEventType() {
    this.eventService.getAllEvent().subscribe((res: ResponseModel) => {
      if (res.errors) {
        console.log('error');
      } else {
        this.allEventType = res.data;
      }
    });
  }

  getAllEventInchareg() {
    this.userService.getAllUsers().subscribe((res: ResponseModel) => {
      if (res.errors) {
        console.log('error');
      } else {
        this.allInCharge = res.data;
      }
    });
  }

  getAllMarketingMaterial() {
    this.eventService.getAllMarketingMaterial().subscribe((res: ResponseModel) => {
      if (res.errors) {
        console.log('error');
      } else {
        this.allMarketingMaterial = res.data;
      }
    });

  }

  getAllFarms() {
    this.orderService.getAllFarms().subscribe((res: ResponseModel) => {
      if (res.errors) {
        console.log('error');
      } else {
        this.allFarms = res.data;
      }
    });
  }

  editMainEvent(i) {
    this.editing = true;
    this.cuurentEventEdit = this.mainEvent[i]
    this.currentEventIdEdit = this.mainEvent[i]._id
    this.currentIndexEdit = i;
    this.productsForms.controls = []
    this.MaterialForms.controls = []
    this.InchargeForm.controls = []
    this.eventForm.reset();
    if (this.mainEvent[i].products)
      for (var index = 0; index < this.mainEvent[i].products.length; index++) {
        const product = this.formBuilder.group({
          product: this.mainEvent[i].products[index].product._id,
          quantity: this.mainEvent[i].products[index].quantity
        })
        this.productsForms.push(product)
      }
    for (var index = 0; index < this.mainEvent[i].marketingMaterial.length; index++) {
      const material = this.formBuilder.group({
        material: this.mainEvent[i].marketingMaterial[index].material._id,
        quantity: this.mainEvent[i].marketingMaterial[index].quantity
      })
      this.MaterialForms.push(material)
    }
    for (var index = 0; index < this.mainEvent[i].incharge.length; index++) {
      const incharge = this.formBuilder.group({
        incharge: this.mainEvent[i].incharge[index]._id
      })
      this.InchargeForm.push(incharge)
    }
    if (this.mainEvent[i].marketingMaterial)

      this.eventForm.value.marketingMaterial = this.mainEvent[i].marketingMaterial
    if (this.mainEvent[i].incharge)
      this.eventForm.value.incharge = this.mainEvent[i].incharge
    this.editMarketingMaterialArray = this.mainEvent[i].marketingMaterial
    this.editAddProductsArray = this.mainEvent[i].products
    this.editAddInchargeArray = this.mainEvent[i].incharge
    this.setFormValue()
  }

  setFormValue() {
    const event = this.mainEvent[this.currentIndexEdit]
    console.log(event)
    if (this.editing) {
      if (this.mainEvent[this.currentIndexEdit].cancelled == true) {
        this.status = "Event Cancelled"
      }
      else {
        this.status = "Event On Time"
      }
    }
    if (event)
      this.eventForm.controls['name'].setValue(event.name)
    this.eventForm.controls['type'].setValue(event.type._id)
    this.eventForm.controls['address'].setValue(event.address)
    this.eventForm.controls['organizer'].setValue(event.organizer._id)
    this.eventForm.controls['targetLeads'].setValue(event.targetLeads)
    this.eventForm.controls['targetLeads'].setValue(event.targetLeads)
    this.eventForm.controls['targetConversion'].setValue(event.targetConversion)
    this.eventForm.controls['farm'].setValue(event.farm._id)
    this.eventForm.controls['phone'].setValue(event.phone)
    this.eventForm.controls['cost'].setValue(event.cost)
    this.eventForm.controls['hub'].setValue(event.hub._id)
    this.eventForm.controls['city'].setValue(event.city._id)
    var newdate = new Date(event.time)
    this.selectedDateEdit = moment(newdate).format().slice(0, 16)
    this.eventForm.controls['time'].setValue(this.selectedDateEdit)
    this.eventForm.controls['status'].setValue(event.status)
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.status = null
    this.productsForms.controls = []
    this.MaterialForms.controls = []
    this.InchargeForm.controls = []
    this.eventForm.reset();
  }

  get f() { return this.eventForm.controls; }

  onSubmit() {

    console.log(this.eventForm.value)
    this.submitted = true;
    if (this.eventForm.invalid) {
      return;
    }
    if (this.eventForm.value.incharge.length > 0)
      for (var i = 0; i < this.eventForm.value.incharge.length; i++) {
        this.eventForm.value.incharge[i] = this.eventForm.value.incharge[i].incharge
      }
    if (this.editing) {
      this.updateEvent(this.eventForm.value);
    } else {
      this.addEvent(this.eventForm.value);
    }
  }

  addEvent(event) {
    console.log(event)
    this.eventService.addMainEvent(event).subscribe((res: ResponseModel) => {
      console.log(res.data)
      var newdate = new Date(event.time)
      this.selectedDateAddEvent = moment(newdate).format('LLL')
      jQuery('#modal3').modal('hide');
      this.toasterService.success('Successfully added new event named ' + res.data.name + 'on' + this.selectedDateAddEvent + '.' + 'Notifications for the same has been sent to ' + res.data.incharge[0].full_name + '.', 'Success');
      this.mainEvent.push(res.data);
      this.pendingCallsLeads.push(0)
      this.convertedCallsLeads.push(0)
      this.resetForm();
    });
  }

  updateEvent(event) {
    console.log(event)
    // const id = this.allEvents[this.currentIndexEdit]._id;
    if (this.currentEventIdEdit) {
      this.eventService.updateMainEvent(event, this.currentEventIdEdit).subscribe((res: ResponseModel) => {
        jQuery('#modal3').modal('hide');
        this.toasterService.info('State Updated Successfully!', 'Updated!!');
        this.resetForm();
        console.log(res.data)
        this.mainEvent.splice(this.currentIndexEdit, 1, res.data);
        this.currentEventId = null;
        this.editing = false;
      });
    }
  }

  viewMainEvent(i) {
    this.leadslength=0;
    this.conversionLeangth=0;
    this.pendingLength=0;
    var leadscount=0;
    var leadscountbystatus=0;
    var totalleads=0;
    this.eventService.getAllLeadsMainEventbyId(this.mainEvent[i]._id).subscribe((res:ResponseModel)=>{
      console.log(res.data)
      this.specificEventRecords=res.data
      if(res.data){
        this.showSpecificEventRecords=true
      }
      else{
        this.showSpecificEventRecords=false
      }
    })
    this.viewArray = this.mainEvent[i]
    this.mainEventId = this.mainEvent[i]._id
    this.mainEventIndex = i
    console.log(this.viewArray)
    this.timeFormat = moment(this.mainEvent[i].time).format('LLL');
    console.log(this.timeFormat)
    if (this.mainEvent[i].cancelled == true) {
      this.status = "Event Cancelled"
    }
    else {
      this.status = "Event On Time"
    }
    if (this.mainEvent[i])
    console.log(this.viewArray);

    // for (var index = 0; index < this.mainEvent[i].length; index++) {
      
      if (this.mainEvent[i].leads) {
        for (var j = 0; j < this.mainEvent[i].leads.length; j++) {
          console.log(this.mainEvent[i].leads[j]);
          if(this.mainEvent[i].leads[j])
          totalleads=totalleads+1
          if (this.mainEvent[i].leads[j].callStatus == 'pending') {
            leadscount = leadscount + 1
            console.log("pending");
          }
          if (this.mainEvent[i].leads[j].status == 'converted') {
            leadscountbystatus = leadscountbystatus + 1
            console.log("leadconverted");
          }
        }
        
      }
    // }
    this.leadslength=totalleads
    this.conversionLeangth=leadscountbystatus
    this.pendingLength=leadscount
    console.log(totalleads,leadscountbystatus,leadscount)
  }
  cancelEvent() {
    if (this.mainEventId) {
      this.eventService.updateStatusMainEvent(this.mainEventId).subscribe((res: ResponseModel) => {
        this.mainEvent.splice(this.mainEventIndex, 1, res.data)
        this.mainEventIndex = null;
        this.mainEventId = null;
        this.toasterService.info('Event Cancelled Successfully!', 'Cancelled!!')
        jQuery('exampleModal').modal('hide')
      })
    }
  }

  cancelEventSelected() {
    if (this.currentEventIdEdit) {
      this.eventService.updateStatusMainEvent(this.currentEventIdEdit).subscribe((res: ResponseModel) => {
        this.mainEvent.splice(this.currentIndexEdit, 1, res.data);
        this.currentEventIdEdit = null;
        this.editing = false;
        this.toasterService.info('Event Cancelled Successfully!', 'Cancelled!!');
        jQuery('#modal3').modal('hide');
      })
    }
  }

  deleteEvent(i) {
    if (confirm('You Sure you want to delete this Product')) {
      this.eventService.deleteMainEvent(this.mainEvent[i]._id).toPromise().then(() => {
        this.toasterService.warning('Event Deleted!', 'Deleted!');
        this.mainEvent.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  getEventsByLeadStatus(){
    console.log(this.leadStatus)
    this.leadStatusLeads.length=0
    this.callingStatusLeads.length=0
    this.showCallingStatusLeads=false
    if(this.viewArray)
    this.eventService.getAllMainEventByLeadStatus({event:this.mainEvent[this.mainEventIndex]._id,status:this.leadStatus}).subscribe((res: ResponseModel) => {
      if(res.data){
      this.showLeadStatusLeads=true
      this.leadStatusLeads=res.data
      console.log(res.data);
      }
      else{
        this.showLeadStatusLeads=false
      }
    })
  }

  getEventsByLeadCallingStatus(){
    this.callingStatusLeads.length=0
    this.leadStatusLeads.length=0
    this.showLeadStatusLeads=false
    console.log(this.callingStatus)
    if(this.viewArray)
    this.eventService.getAllMainEventByCallingStatus({event:this.mainEvent[this.mainEventIndex]._id,status:this.callingStatus}).subscribe((res: ResponseModel) => {
      if(res.data){
      this.showCallingStatusLeads=true
      this.callingStatusLeads=res.data
      console.log(res.data);
      }
      else{
        this.showCallingStatusLeads=false
      }
    })
  }
  viewLeadleadStatusLeads(i){
    if(this.viewSpecificEventRecords){
    this.viewSpecificEventRecords=null
    this.showSpecificEventRecords=false
    }
    if(this.leadViewingByLeadStatus){
      this.leadViewingByLeadStatus=null;
      this.showleadViewingByLeadStatus=false
      }
      if(this.leadViewingByLeadCallStatus){
        this.leadViewingByLeadCallStatus=null
        this.showleadViewingByLeadCommentStatus=false
      }
    if(this.showLeadStatusLeads)
    this.leadViewingByLeadStatus=this.leadStatusLeads[i]
    console.log(this.leadViewingByLeadStatus)
    this.timeFormat=moment(this.leadStatusLeads[i].preferredTime).format('LLL');
    this.leadSelectedid=this.leadStatusLeads[i]._id
    this.leadIndex=i;
    if(this.leadViewingByLeadStatus.comments.length>0){
      this.showleadViewingByLeadStatus=true
    }
    else{
      this.showleadViewingByLeadStatus=false
    }
    jQuery('#leadsDetailsModal').modal('show')
    this.CommentForm.controls['StatusForm'].get('status').setValue(this.leadViewingByLeadStatus.status)
    this.CommentForm.controls['StatusForm'].get('callStatus').setValue(this.leadViewingByLeadStatus.callStatus)
  }
  viewLeadcallingStatusLeads(i){
    if(this.viewSpecificEventRecords){
      this.viewSpecificEventRecords=null
      this.showSpecificEventRecords=false
      }
    if(this.leadViewingByLeadStatus){
      this.leadViewingByLeadStatus=null;
      this.showleadViewingByLeadStatus=false
      }
      if(this.leadViewingByLeadCallStatus){
        this.leadViewingByLeadCallStatus=null
        this.showleadViewingByLeadCommentStatus=false
      }
    if(this.callingStatusLeads)
    this.leadViewingByLeadCallStatus=this.callingStatusLeads[i]
    console.log(this.leadViewingByLeadCallStatus)
    this.timeFormat=moment( this.leadViewingByLeadCallStatus).format('LLL');
    this.leadSelectedid=this.callingStatusLeads[i]._id
    this.leadIndex=i;
    if(this.leadViewingByLeadCallStatus.comments.length>0){
      this.showleadViewingByLeadCommentStatus=true
    }
    else{
      this.showleadViewingByLeadCommentStatus=false
    }
    jQuery('#leadsDetailsModal').modal('show')
    this.CommentForm.controls['StatusForm'].get('status').setValue(this.leadViewingByLeadCallStatus.status)
    this.CommentForm.controls['StatusForm'].get('callStatus').setValue(this.leadViewingByLeadCallStatus.callStatus)
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
      this.leadStatusLeads.splice(this.leadIndex,1,res.data)
      jQuery('#leadsDetailsModal').modal('hide');
      this.toasterService.success('Comment Added', 'Success!');
      this.myInputVariable.nativeElement.value = "";
      this.CommentForm.reset();
      this.leadSelectedid=null
      this.leadIndex=null
      this.timeFormat=null;
    })
  }

  viewSpecificLeads(i){
    if(this.viewSpecificEventRecords){
      this.viewSpecificEventRecords=null
      this.showSpecificEventRecords=false
      }
    if(this.leadViewingByLeadStatus){
      this.leadViewingByLeadStatus=null;
      this.showleadViewingByLeadStatus=false
      }
      if(this.leadViewingByLeadCallStatus){
        this.leadViewingByLeadCallStatus=null
        this.showleadViewingByLeadCommentStatus=false
      }
    this.viewSpecificEventRecords=this.specificEventRecords[i]
    console.log(this.viewSpecificEventRecords)
    this.timeFormat=moment( this.viewSpecificEventRecords).format('LLL');
    this.leadSelectedid=this.specificEventRecords[i]._id
    this.leadIndex=i;
    if(this.specificEventRecords[i].comments.length>0){
      this.showSpecificEventRecords=true
    }
    else{
      this.showSpecificEventRecords=false
    }
    jQuery('#leadsDetailsModal').modal('show')
    this.CommentForm.controls['StatusForm'].get('status').setValue(this.specificEventRecords[i].status)
    this.CommentForm.controls['StatusForm'].get('callStatus').setValue(this.specificEventRecords[i].callStatus)
  }

  navigateToLead(){
    this.router.navigate(['/lead'])
  }
}
