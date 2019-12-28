import { Component, OnInit, ViewChild } from '@angular/core';
import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventSesrvice } from '../../../event.service';
import interactionPlugin from '@fullcalendar/interaction';
import { EventService } from '../shared/event-type.service';
import { ResponseModel } from '../../../shared/shared.model';
import { OrderService } from '../../order-module/shared/order.service';
import { UserService } from '../../user/shared/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../products/shared/products.service';
import { LocationManagerService } from '../../location-manager/shared/location-manager.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserModel } from '../../user/shared/user.model';
import * as moment from 'moment';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-event-calender',
  templateUrl: './event-calender.component.html',
  styleUrls: ['./event-calender.component.scss']
})
export class EventCalenderComponent implements OnInit {
  options: OptionsInput;
  eventsModel: any;
  mainEvent:any[]=[];
  mainEvent2:any[]=[];
  allEvents:any[]=[]
  allEvents2:any[]=[];
  allEvents3:any[]=[];
  allCities:any[]=[];
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
  allproducts:any[]=[];
  allHubs:any[]=[];
  selectedDate:any;
  selectedDateEdit:any;
  selectedTime:any;
  allFormIncharge:any[]=[];
  viewArray:any[]=[];
  timeFormat:any;
  mainEventId:any;
  mainEventIndex:any;
  status:any;
  cuurentEventEdit:any;
  currentIndexEdit:number;
  currentEventIdEdit:any;
  editAddInchargeArray:any=[];
  editAddProductsArray:any=[];
  editMarketingMaterialArray:any=[];
  events2: CalendarEvent[] = [];
  selectedDateIndex:any;
  totalEventsMonth:number
  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
  totalConversions: number;
  totalLeads: number;
  selectedDateAddEvent: string;
  constructor( private eventService: EventService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private userService: UserService,
    private toasterService: ToastrService,
    private productService:ProductsService,
    private locationService:LocationManagerService) {
    this.getAllMainEvents()
    this.getAllEventOrganizer();
    this.getAllEventInchareg();
    this.getAllEventType();
    this.getAllFarms();
    this.getProducts();
    this.getHubs();
    this.getAllMarketingMaterial();
    this.getCity();
   }

  ngOnInit() {
    console.log(moment().format('MMMM'));

    
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
      hub: ['', Validators.required]
    });
    this.options = {
      editable: true,
      header: {
        left: 'prev,next today ',
        center: 'title',
      },
      plugins: [dayGridPlugin, interactionPlugin]
    };
  }

  getAllMainEvents(){
    this.allEvents.length=0
    this.allEvents2.length=0
    this.allEvents3.length=0
    this.eventService.getAllMainEvent().subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.errors) {
        console.log('error');
      } else {
        this.mainEvent = res.data;
        if(res.data){
          var totevents=0
          var sumLead=0;
          var sumConversion=0;
          for(var i=0;i<res.data.length;i++){
            if(moment(new Date()).format('MMMM')==moment(res.data[i].time).format('MMMM')){
              totevents++;
              sumLead=sumLead+res.data[i].targetLeads
              sumConversion=sumConversion+res.data[i].targetConversion
            }
            this.allEvents.push({title:res.data[i].name,start: res.data[i].time.slice(0,10), color: '#4285F4'})
          }
          this.totalEventsMonth=totevents
          this.totalLeads=sumLead
          this.totalConversions=sumConversion
          this.allEvents2=this.allEvents
          this.allEvents3=this.allEvents2
        }
      }
    });
  }
  
  eventClick(model) {
    console.log(moment(model.event._instance.range.start).format(),moment(this.mainEvent[0].time).format());
    for(var i=0;i<this.mainEvent.length;i++){
      if(moment(model.event._instance.range.start).format().slice(0, 11)==moment(this.mainEvent[i].time).format().slice(0, 11)){
        console.log(i)
        this.selectedDateIndex=i;

      }
    }
    
    this.editing=true;
    this.cuurentEventEdit=this.mainEvent[ this.selectedDateIndex]
    this.currentEventIdEdit=this.mainEvent[ this.selectedDateIndex]._id
    this.currentIndexEdit=i;
    this.productsForms.controls=[]
    this.MaterialForms.controls=[]
    this.InchargeForm.controls=[]
    this.eventForm.reset();
    if(this.mainEvent[this.selectedDateIndex].products)
    for(var index=0;index<this.mainEvent[ this.selectedDateIndex].products.length;index++){
      const product = this.formBuilder.group({ 
        product:this.mainEvent[ this.selectedDateIndex].products[index].product._id,
        quantity:this.mainEvent[ this.selectedDateIndex].products[index].quantity
      })
      this.productsForms.push(product)
    }
    for(var index=0;index<this.mainEvent[ this.selectedDateIndex].marketingMaterial.length;index++){
      const material = this.formBuilder.group({ 
        material:this.mainEvent[ this.selectedDateIndex].marketingMaterial[index].material._id,
        quantity:this.mainEvent[ this.selectedDateIndex].marketingMaterial[index].quantity
      })
      this.MaterialForms.push(material)
    }
    for(var index=0;index<this.mainEvent[ this.selectedDateIndex].incharge.length;index++){
      const incharge = this.formBuilder.group({ 
        incharge:this.mainEvent[ this.selectedDateIndex].incharge[index]._id
      })
      this.InchargeForm.push(incharge)
    }
    if(this.mainEvent[ this.selectedDateIndex].marketingMaterial)
    
    this.eventForm.value.marketingMaterial=this.mainEvent[ this.selectedDateIndex].marketingMaterial
    if(this.mainEvent[ this.selectedDateIndex].incharge)
    this.eventForm.value.incharge=this.mainEvent[ this.selectedDateIndex].incharge
    this.editMarketingMaterialArray=this.mainEvent[ this.selectedDateIndex].marketingMaterial
    this.editAddProductsArray=this.mainEvent[ this.selectedDateIndex].products
    this.editAddInchargeArray=this.mainEvent[ this.selectedDateIndex].incharge
    this.setFormValue()
  }

  setFormValue(){
    const event=this.mainEvent[this.selectedDateIndex]
    console.log(event)
    if(event)
    if(this.editing){
    if(this.mainEvent[this.selectedDateIndex].cancelled==true){
      this.status="Event Cancelled"
    }
    else{
      this.status="Event On Time"
    }
  }
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
    
    var newdate= new Date(event.time)
    this.selectedDateEdit=moment(newdate).format().slice(0, 16)
    jQuery('#modal3').modal('show')
  }
  eventDragStop(model) {
    console.log(model);
  }
  dateClick(model) {
    this.resetForm();
    var newdate= new Date(model.date)
    this.selectedDate=moment(newdate).format().slice(0, 16)
    console.log(this.selectedDate)
    jQuery('#modal3').modal('show')
  }
  updateHeader() {
    this.options.header = {
      left: 'prev,next myCustomButton',
      center: 'title',
    };
  }
  updateEvents() {
    this.eventsModel = [{
      title: 'Updaten Event',
      start: this.yearMonth + '-08',
      end: this.yearMonth + '-10'
    }];
  }
  get yearMonth(): string {
    const dateObj = new Date();
    return dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
  }

  getProducts() {
    this.allproducts.length = 0;
    this.productService.getAllProduct().subscribe((res:ResponseModel) => {
      this.allproducts = res.data;
    });
  }


  getCity(){
    this.locationService.getAllCity().subscribe((res:ResponseModel)=>{
      this.allCities=res.data
      console.log(this.allCities)
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

  getHubs(){
    this.productService.getAllHub().subscribe((res:ResponseModel) => {
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

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.status=null
    this.productsForms.controls=[]
    this.MaterialForms.controls=[]
    this.InchargeForm.controls=[]
    this.eventForm.reset();
  }

  get f() { return this.eventForm.controls; }

  onSubmit() {
    if(this.editing){
      this.eventForm.value.time=this.selectedDateEdit
    }
    if(!this.editing){
    this.eventForm.value.time=this.selectedDate
    }
    this.submitted = true;
    if (this.eventForm.invalid) {
      return;
    }
    if(this.eventForm.value.incharge.length>0)
    for(var i=0;i<this.eventForm.value.incharge.length;i++){
      this.eventForm.value.incharge[i]=this.eventForm.value.incharge[i].incharge
    }
    if (this.editing) {
      this.updateEvent(this.eventForm.value)
    } else {
      this.addEvent(this.eventForm.value);
    }
  }

  addEvent(event) {
    console.log(event)
    this.eventService.addMainEvent(event).subscribe((res: ResponseModel) => {
      console.log(res.data)
      jQuery('#modal3').modal('hide');
      var newdate= new Date(event.time)
      this.selectedDateAddEvent=moment(newdate).format('LLL')
      this.toasterService.success('Successfully added new event named '+ res.data.name + 'on' + this.selectedDateAddEvent + '.' + 'Notifications for the same has been sent to ' + res.data.incharge[0].full_name + '.', 'Success');
      
      this.allEvents2.push({title:res.data.name,start: res.data.time.slice(0,10), color: '#4285F4'})
      this.mainEvent.push(res.data);
      this.resetForm();
    });
  }

  updateEvent(event) {
    console.log(event)
    if (this.currentEventIdEdit) {
      this.eventService.updateMainEvent(event,this.currentEventIdEdit).subscribe((res: ResponseModel) => {
        jQuery('#modal3').modal('hide');
        this.toasterService.info('State Updated Successfully!', 'Updated!!');
        this.resetForm();
        console.log(res.data)
        this.mainEvent.splice( this.selectedDateIndex, 1, res.data);
        this.allEvents2.splice(this.selectedDateIndex, 1,{title:res.data.name,start: res.data.time.slice(0,10), color: '#4285F4'})
        this.currentEventId = null;
        this.editing = false;
      });
    }
  }
  cancelEvent(){
    if(this.currentEventIdEdit ){
      this.eventService.updateStatusMainEvent(this.currentEventIdEdit).subscribe((res:ResponseModel)=>{
        this.mainEvent.splice( this.selectedDateIndex, 1, res.data);
        this.currentEventIdEdit = null;
        this.editing = false;
        this.toasterService.info('Event Cancelled Successfully!', 'Cancelled!!');
        jQuery('#modal3').modal('hide');
      })
    }
  }

  getAllEventsNavBar(){
    this.allEvents.length=0
    this.allEvents2.length=0
    this.allEvents2=this.allEvents3
    console.log(this.allEvents2);
    
  }

  getAllEventsByCity(event){
    this.allEvents.length=0
    this.allEvents2.length=0
    console.log(this.options)
    this.eventService.getAllMainEventByCity(this.allCities[event.target.selectedIndex-1]._id).subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.errors) {
        console.log('error');
      } else {
        if(res.data)
        for(var i=0;i<res.data.length;i++){
          this.allEvents.push({title:res.data[i].name,start: res.data[i].time.slice(0,10), color: '#4285F4'})
        }
        this.allEvents2 = this.allEvents;
        console.log(this.allEvents2);
        console.log(res);
        
      }
    });

  }

  getAllEventsByEventType(event){
    this.allEvents.length=0
    this.allEvents2.length=0
    console.log(event.target.selectedIndex);
    this.eventService.getAllMainEventByEventType(this.allEventType[event.target.selectedIndex-1]._id).subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.errors) {
        console.log('error');
      } else {
        if(res.data)
        for(var i=0;i<res.data.length;i++){
          this.allEvents.push({title:res.data[i].name,start: res.data[i].time.slice(0,10), color: '#4285F4'})
        }
        this.allEvents2 = this.allEvents;
        console.log(this.allEvents2);
      }
    });
    
  }

}


