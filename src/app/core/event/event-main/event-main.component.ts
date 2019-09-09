import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-event-main',
  templateUrl: './event-main.component.html',
  styleUrls: ['./event-main.component.scss']
})
export class EventMainComponent implements OnInit {

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
  editing: Boolean = false;
  submitted: Boolean = false;
  allproducts:any[]=[];
  allHubs:any[]=[];
  selectedDate:any;
  selectedTime:any;
  mainEvent:any[]=[];
  allFormIncharge:any[]=[];
  viewArray:any[]=[];
  timeFormat:any;
  mainEventId:any;
  mainEventIndex:any;
  status:any;
  constructor(private formBuilder: FormBuilder,
    private eventService: EventService,
    private orderService: OrderService,
    private userService: UserService,
    private toasterService: ToastrService,
    private productService:ProductsService) {
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
    this.productService.getAllProduct().subscribe((res:ResponseModel) => {
      this.allproducts = res.data;
    });
  }

  getAllMainEvents(){
    this.eventService.getAllMainEvent().subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.error) {
        console.log('error');
      } else {
        this.mainEvent = res.data;
        console.log(res);
        this.dtTrigger.next()
      }
    });
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

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.eventForm.reset();
  }

  get f() { return this.eventForm.controls; }

  onSubmit() {
    if(this.eventForm.value.incharge.length>0)
    for(var i=0;i<this.eventForm.value.incharge.length;i++){
      this.eventForm.value.incharge[i]=this.eventForm.value.incharge[i].incharge
    }
    console.log(this.eventForm.value)
    this.submitted = true;
    if (this.eventForm.invalid) {
      return;
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
      jQuery('#modal3').modal('hide');
      this.toasterService.success('Event Added', 'Success!');
      this.mainEvent.push(res.data);
      this.resetForm();
    });
  }

  updateEvent(event) {
    const id = this.allEvents[this.currentIndex]._id;
    if (id) {
      this.eventService.updateEvent(event, id).subscribe((res: ResponseModel) => {
        jQuery('#modal3').modal('hide');
        this.toasterService.info('State Updated Successfully!', 'Updated!!');
        this.resetForm();
        this.allEvents.splice(this.currentIndex, 1, res.data);
        this.currentEventId = null;
        this.editing = false;
      });
    }
  }

  viewMainEvent(i){
    this.viewArray=this.mainEvent[i]
    this.mainEventId=this.mainEvent[i]._id
    this.mainEventIndex=i
    console.log(this.viewArray)
    this.timeFormat=moment(this.mainEvent[i].time).format('LLL');
    console.log(this.timeFormat)
    if(this.mainEvent[i].cancelled==true){
      this.status="Event Cancelled"
    }
    else{
      this.status="Event On Time"
    }
  }
  cancelEvent(){
    if(this.mainEventId){
      this.eventService.updateStatusMainEvent(this.mainEventId).subscribe((res:ResponseModel)=>{
        this.mainEvent.splice(this.mainEventIndex,1,res.data)
        this.mainEventIndex=null;
        this.mainEventId=null;
        this.toasterService.info('Event Cancelled Successfully!', 'Cancelled!!')
        jQuery('exampleModal').modal('hide')
      })
    }
  }

}
