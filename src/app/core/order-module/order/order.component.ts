import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ProductModel } from '../../products/shared/product.model';
import { AuthService } from '../../../auth/auth.service';
import { ProductsService } from '../../products/shared/products.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { OrderService } from '../shared/order.service';
import { OrderModel } from '../shared/order.model';
import { ResponseModel } from '../../../shared/shared.model';
import { UserService } from '../../user/shared/user-service.service';
import { TruckService } from '../../truck/shared/truck.service';
import { VehicleModel, DriverModel } from '../../truck/shared/truck.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  jQuery: any;
  allproducts: ProductModel[] = [];
  allOrders: any[] = [];
  allUsers: any[] = [];
  orderSelected:any;
  currentOrder: OrderModel;
  currentOrderProducts:ProductModel;
  currentOrderPlaced_to:any;
  currentOrderId: string;
  currentIndex: number;
  challanForm: FormGroup;
  valueForm: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: Boolean = false;
  orderForm: FormGroup;
  orderStatus: Boolean;
  CSV: File = null;
  fileReader: FileReader = new FileReader();
  parsedCSV;
  showSummary: Boolean = false;
  uploading: Boolean = false;
  updatedOrder;
  submitted: Boolean = false;
  orderPlacedForm: FormGroup; 
  acceptedValueForm:FormGroup;
  currentOrder2:OrderModel;
  orderIndex:any;
  array:any[]=[];
  orderSelectedProducts:any=[];
  orderSelectedNotes:any;
  orderId:String; 
  driverIndex: any;
  vehicleIndex: any;
  allVehicle: VehicleModel[] = [];
  alldriver: DriverModel[] = [];
  challanDriver:any=[];
  challanVehicle:any=[];
  fieldChangedOrder:OrderModel;
  afterStatus:any;
  selectedStatus:any;
  dispatchValueForm:FormGroup
  constructor(private productService: ProductsService, private fb: FormBuilder, private toastr: ToastrService,
    private authService: AuthService, private orderService: OrderService, private userService: UserService,private vehicleService: TruckService
  ) {
    // this.initForm();
    // this.initChallanForm();
    this.getOrders();
    this.getUsers();
    this.getVehicle();
    this.getDrivers();
  }

  ngOnInit() {
    this.getProducts();
    this.orderPlacedForm = this.fb.group({
      placed_to: ['',Validators.required],
      notes:[''],
      products: this.fb.array([])
    })
    this.acceptedValueForm=this.fb.group({
      accepted:this.fb.array([])
    })
    this.dispatchValueForm=this.fb.group({
      dispatched:this.fb.array([])
    })
    this.challanForm = this.fb.group({
      dispatch_processing_unit: ['', Validators.required],
      products:this.fb.array([]),
      vehicle: ['', Validators.required],
      driver: ['', Validators.required],  
      departure: ['', Validators.required],
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      dom: '<\'html5buttons\'B>lTfgitp\'',
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

  asd(event:any,i){
    if(event.target.value){
    var arr=[];
    arr=event.target.value;
    this.acceptedValueForm.value.accepted[i]=arr
    console.log(this.acceptedValueForm.value)
    this.array.push
    this.acceptedForms;
    console.log(i)
    this.qw()
    }
  }

  dispatchQuantityEntered(event:any,i){
    if(event.target.value){
      var arr=event.target.value;
      this.dispatchValueForm.value.dispatched[i]=arr
      this.dispatchArray()
      }
  }

  dispatchArray(){
    for(var i=0;i<this.dispatchValueForm.value.dispatched.length;i++){
      this.orderSelected.products[i].dispatched=Number(this.dispatchValueForm.value.dispatched[i])
    }
    console.log(this.orderSelected);
    
  }

  asde(){
    this.orderSelected.status=true;
    const order=<any> new Object;
    order.products=this.orderSelected.products;
    for(var i=0;i<this.orderSelectedProducts.length;i++){
      order.products[i].product=this.orderSelectedProducts[i].product._id
      delete order.products[i]._id;
      delete order.products[i].requested;
      delete order.products[i].recieved;
      delete order.products[i].dispatched;
      delete order.products[i].billed;
    }
    console.log(order)
    this.orderService.addAcceptedOrder(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
      jQuery('#invoiceModal').modal('hide');
      this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
      console.log(res.data)
    })
  }
  qw(){
    
    for(var i=0;i<this.acceptedValueForm.value.accepted.length;i++){
      this.orderSelected.products[i].accepted=Number(this.acceptedValueForm.value.accepted[i])
    }
  }
  get productsForms() {
    
    return this.orderPlacedForm.get('products') as FormArray;
    
  }

  get acceptedForms() {
    console.log(this.acceptedValueForm)
    return this.acceptedValueForm.get('accepted') as FormArray;
    
  }
  addProducts() {

    const product = this.fb.group({ 
      product: [],
      requested: []
    })
  
    this.productsForms.push(product);
  }

  addAcceptedQuantity(){
    const accepted=this.fb.group({
      accepted:[]
    })
    this.acceptedForms.push(accepted)
  }
  
  deleteProducts(i) {
    this.productsForms.removeAt(i)
  }
  get f() { return this.orderPlacedForm.controls; }
  get f2() { return this.challanForm.controls; }
  submit() {
    this.submitted = true;
    if (this.orderForm.invalid) {
      return;
    }
    this.orderForm.get('status').setValue(false);
    // for (let index = 0; index < this.formArr.length; index++) {
    //   this.formArr.controls[index].get('accepted').setValue(0);

    // }
    this.currentOrder = this.orderForm.value;
    this.addOrder(this.orderForm.value);
  }

  submitChallan(){
    if (this.challanForm.invalid) {
      return;
    }
    console.log(this.challanForm)

  }
  onSubmit(){
    this.submitted = true;
    if (this.orderPlacedForm.invalid) {
      return;
    }
    this.currentOrder2=this.orderPlacedForm.value;
    console.log(this.orderPlacedForm.value)
      this.addOrder(this.orderPlacedForm.value);
    
  }
  viewAcceptOrderButton(i){
    this.orderSelected=this.allOrders[i];
    this.orderSelectedProducts=this.allOrders[i].products;
    this.orderSelectedNotes=this.allOrders[i].notes;
    this.orderId=this.allOrders[i]._id
    this.orderIndex=i;
    console.log(this.orderSelected)
    console.log(this.orderId)
  }

  statusSelected(event:any){
   this.selectedStatus=this.afterStatus[event.target.selectedIndex-1]
   console.log(this.selectedStatus)
  }
  addOrder(order) {
    console.log(order)
    this.orderService.addOrder(order).subscribe((res: ResponseModel) => {
      if (res.error) {
        this.toastr.warning('Error', res.error);
      } else {
        console.log(res);
        jQuery('#modal3').modal('hide');
        this.toastr.success('Order Added!', 'Success!');
        this.allOrders.push(res.data);
        this.resetForm();
      }
    });
  }

  editOrder(i) {
    this.editing = true;
    this.currentOrder = this.allOrders[i];
    this.currentOrderProducts=this.allOrders[i].products
    this.currentOrderPlaced_to=this.allOrders[i].placed_to;
    // console.log(this.cu)
    console.log(this.currentOrderProducts)
    console.log(this.currentOrder)
    this.currentOrderId = this.allOrders[i]._id;
    this.currentIndex = i;
    this.setFormValue();
  }

  // viewSummary(i) {
  //   while (this.valueArr.length !== 0) { this.valueArr.removeAt(0); }
  //   this.showSummary = true;
  //   this.currentOrder = this.allOrders[i];
  //   for (let index = 0; index < this.currentOrder.products.length; index++) {
  //     this.valueArr.push(this.initValueRows());
  //   }
  //   for (let index = 0; index < this.valueArr.length; index++) {
  //     this.valueArr.controls[index].get('accepted').setValue(this.currentOrder.products[index].accepted);
  //   }
  // }

  deleteOrder(i) {
    if (confirm('You Sure you want to delete this Order')) {
      this.orderService.deleteOrder(this.allOrders[i]._id).toPromise().then(() => {
        this.toastr.warning('Products Deleted!', 'Deleted!');
        this.allOrders.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  getProducts() {
    this.allproducts.length = 0;
    this.productService.getAllProduct().subscribe((res:ResponseModel) => {
      this.allproducts = res.data;
      console.log(res.data)
      this.dtTrigger.next();
    });
  }

  getUsers() {
    this.allUsers.length = 0;
    this.userService.getAllUsers().subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.error) {
        this.toastr.warning('Error', res.error);
      } else {
        this.allUsers = res.data;
      }
    });
  }

  getOrders() {
    this.allOrders.length = 0;
    this.orderService.getAllOrders().subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.error) {
        this.toastr.warning('Error', res.error);
      } else {
        this.allOrders = res.data;
        console.log(this.allOrders);
        this.dtTrigger.next();
      }
    });
  }

  getVehicle() {
    this.vehicleService.getAllVehicles().subscribe((res: ResponseModel) => {
      this.allVehicle = res.data;
      console.log(res.data);
    });
  }

  getDrivers() {
    this.vehicleService.getAllDrivers().subscribe((res: ResponseModel) => {
      this.alldriver = res.data;
      console.log(res.data);
    });
  }

  updateOrder(order) {
    console.log(order)
    this.orderService.updateOrder(order, this.orderId).subscribe((res: ResponseModel) => {
      jQuery('#invoiceModal').modal('hide');
      this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
      this.resetForm();
      console.log(res.data);
      this.allOrders.splice(this.orderIndex, 1, res.data);
      this.orderId = null;
      this.editing = false;
    });
  }

  // initForm() {
  //   this.orderForm = this.formBuilder.group({
  //     status: ['', Validators.required],
  //     placed_to: ['', Validators.required],
  //     notes: [''],
  //     products: this.formBuilder.array([this.initItemRows()])
  //   });
  //   this.valueForm = this.formBuilder.group({
  //     productsArray: this.formBuilder.array([])
  //   });
  // }

  setFormValue() {
    const order:any = this.allOrders[this.currentIndex];
    this.orderPlacedForm.controls['placed_to'].setValue(order.placed_to._id);
    for(var i=0;i<order.products.length;i++){
      this.orderPlacedForm.controls['products'].value[i]=order.products[i];
    }
    this.orderPlacedForm.controls['notes'].setValue(order.notes);
    this.orderPlacedForm.controls['status'].setValue(order.status);
    console.log(this.orderPlacedForm);
  }

  get formArr() {
    return this.orderForm.get('products') as FormArray;
  }

  get valueArr() {
    return this.valueForm.get('productsArray') as FormArray;
  }

  // initItemRows() {
  //   return this.formBuilder.group({
  //     accepted: ['', Validators.required],
  //     product: ['', Validators.required],
  //     quantity: ['', Validators.required],
  //     // value: ['']
  //   });
  // }

  // initValueRows(): FormGroup {
  //   return this.formBuilder.group({
  //     accepted: [''],
  //     // value: ['']
  //   });
  // }


  // addPeriod() {
  //   this.formArr.push(this.initItemRows());
  // }

  removePeriod(i) {
    this.formArr.removeAt(i);
  }

  public uploadCSV(files: FileList) {
    if (files && files.length > 0) {
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.parsedCSV = reader.result;
        // let csv = reader.result;
        // this.extractData(csv)
      };
    }
  }

  public extractData() {
    this.uploading = true;
    const lines = this.parsedCSV.split(/\r\n|\n/);
    const result = [];
    const headers: any[] = lines[0].split(',');
    if (headers[0] === 'brand' && headers[1] === 'is_active' && headers[2] === 'cif_price' && headers[3] === 'business_unit'
      && headers[4] === 'business_unit_id' && headers[5] === 'distirbutor'
      && headers[6] === 'form' && headers[7] === 'notes' && headers[8] === 'pack_size'
      && headers[9] === 'promoted' && headers[10] === 'range' && headers[11] === 'registered'
      && headers[12] === 'strength' && headers[13] === 'therapy_line_id' && headers[14] === 'therapy_line'
      && headers[15] === 'whole_price' && headers[16] === 'sku_id'
    ) {
      for (let i = 1; i < lines.length - 1; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      this.productService.importCustomer(result).subscribe(res => {
        setTimeout(() => {
          this.uploading = false;
          this.toastr.success('Product added successfully', 'Upload Success');
          jQuery('#modal2').modal('hide');
          // this.allproducts.push(res);
        }, 1000);
      });
      // this.newproduct = result;
    } else {
      this.toastr.error('Try Again', 'Upload Failed');
      // this.reset();
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.orderPlacedForm.reset();
  }

  // generateChallan() {
  //   jQuery('#challanModel').modal('show');
  //   for (let index = 0; index < this.currentOrder.products.length; index++) {
  //     this.productsArray.push(this.initItemRows());
  //   }
  // }

  saveAndAcceptOrder() {
    const updatedOrder = this.currentOrder;
    updatedOrder.status = false;
  }
  get productsArray() {
    return this.challanForm.get('products') as FormArray;
  }

  // initChallanForm() {
  //   this.challanForm = this.formBuilder.group({
  //     dispatch_processing_unit: ['', Validators.required],
  //     // products: this.formBuilder.array([this.initItemRows()]),
  //     products: [''],
  //     vehicle_no: ['', Validators.required],
  //     vehicle_type: ['', Validators.required],
  //     driver_name: ['', Validators.required],
  //     driver_mobile: ['', Validators.required],
  //     dl_no: ['', Validators.required],
  //     departure: ['', Validators.required],
  //   });
  // }

  saveChallan() {
    const placed_to = this.currentOrder.placed_to._id;
    const order2 = <any>new Object();
    order2.placed_to = placed_to;
    delete order2._id; delete order2.placed_by; delete order2.order_date;
    order2.products = this.currentOrder.products;
    for (let index = 0; index < this.currentOrder.products.length; index++) {
      order2.products[index].product = order2.products[index].product._id;
      delete order2.products[index]._id;
      order2.products[index].accepted = this.currentOrder.products[index].accepted;
      order2.products[index].requested = this.currentOrder.products[index].quantity;
      delete order2.products[index].quantity;
    }
    order2.vehicle_no = this.challanForm.get('vehicle_no').value;
    order2.vehicle_type = this.challanForm.get('vehicle_type').value;
    order2.driver_name = this.challanForm.get('driver_name').value;
    order2.driver_mobile = this.challanForm.get('driver_mobile').value;
    order2.dl_no = this.challanForm.get('dl_no').value;
    order2.departure = this.challanForm.get('departure').value;
    order2.status = true;
    console.log(order2);
    this.challanForm.get('dispatch_processing_unit').setValue(this.currentOrder.placed_to._id);
    this.challanForm.get('products').setValue(this.currentOrder.products);
    console.log(this.challanForm.value);
    this.orderForm.get('status').setValue(true);
    this.orderService.addNewChallan(this.challanForm.value).subscribe((res: ResponseModel) => {
      this.toastr.success('Challan Accepted successfully', 'Accepted');
      console.log(res.data);
      jQuery('#challanModel').modal('hide');
    });
  }

  getDriver(event: any) {
    this.driverIndex = event.target.selectedIndex - 1;
    this.challanDriver=this.alldriver[this.driverIndex]
    console.log(this.challanDriver);
  }
  getVehicle2(event: any) {

    this.vehicleIndex = event.target.selectedIndex - 1;
    this.challanVehicle=this.allVehicle[this.vehicleIndex]
    console.log(this.challanVehicle);
  }

  challanGenerate(){
    console.log(this.orderSelected)
    const date=new Date()
    const productsArray=<any> new Object();
    productsArray.products=this.orderSelected.products;
    for(var i=0;i<this.orderSelected.products.length;i++){
      productsArray.products[i].product=this.orderSelected.products[i].product._id;
      delete productsArray.products[i].accepted;
      delete productsArray.products[i].recieved;
      delete productsArray.products[i].requested;
      delete productsArray.products[i].billed;
      delete productsArray.products[i]._id;
    }
    this.challanForm.controls['vehicle'].setValue(this.challanVehicle._id)
    this.challanForm.controls['driver'].setValue(this.challanDriver._id)
    this.challanForm.controls['departure'].setValue(date)
    this.challanForm.controls['dispatch_processing_unit'].setValue(this.orderSelected.placed_to._id)
    for(var i=0;i<productsArray.products.length;i++){
      this.challanForm.value.products[i]=productsArray.products[i]
    }

    console.log(this.challanForm.value,this.orderSelected._id)

    this.orderService.addOrderChallan(this.challanForm.value,this.orderSelected._id).subscribe((res: ResponseModel) => {
      this.toastr.success('Challan Generated successfully', 'Accepted');
      console.log(res.data);
      jQuery('#ChallanModal').modal('hide');
    });

    
  }
  updateStatusAndGenerateChallan(){
      
  }

}
