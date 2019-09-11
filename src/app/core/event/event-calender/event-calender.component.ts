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

@Component({
  selector: 'app-event-calender',
  templateUrl: './event-calender.component.html',
  styleUrls: ['./event-calender.component.scss']
})
export class EventCalenderComponent implements OnInit {
  options: OptionsInput;
  eventsModel: any;
  mainEvent:any[]=[];
  allEvents:any[]=[]
  allEvents2:any[]=[];
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
  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
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
    this.eventService.getAllMainEvent().subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.error) {
        console.log('error');
      } else {
        this.mainEvent = res.data;
        if(res.data){
          for(var i=0;i<res.data.length;i++){
            this.allEvents.push({title:res.data[i].name,start: res.data[i].time.slice(0,10), color: '#4285F4'})
          }
          this.allEvents2=this.allEvents
        }
        console.log(res.data,this.allEvents2);
      }
    });
  }
  
  eventClick(model) {
    console.log(model);
  }
  eventDragStop(model) {
    console.log(model);
  }
  dateClick(model) {
    this.resetForm();
    this.selectedDate=model.date.toISOString().slice(0, 16);
    console.log(model)
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
      if (res.error) {
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
    this.productsForms.controls=[]
    this.MaterialForms.controls=[]
    this.InchargeForm.controls=[]
    this.eventForm.reset();
  }

  get f() { return this.eventForm.controls; }

  onSubmit() {
    this.eventForm.value.time=this.selectedDate
    this.submitted = true;
    if (this.eventForm.invalid) {
      return;
    }
    if(this.eventForm.value.incharge.length>0)
    for(var i=0;i<this.eventForm.value.incharge.length;i++){
      this.eventForm.value.incharge[i]=this.eventForm.value.incharge[i].incharge
    }
    if (this.editing) {
    } else {
      this.addEvent(this.eventForm.value);
    }
  }

  addEvent(event) {
    console.log(event)
    this.eventService.addMainEvent(event).subscribe((res: ResponseModel) => {
      console.log(res.data)
      jQuery('#modal3').modal('hide');
      this.toasterService.success('Event Added', 'Success!');
      this.allEvents2.push({title:res.data.name,start: res.data.time.slice(0,10), color: '#4285F4'})
      this.mainEvent.push(res.data);
      this.resetForm();
    });
  }
}
