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
import { UserModel } from '../../user/shared/user.model';
import { TruckService } from '../../truck/shared/truck.service';
import { VehicleModel, DriverModel } from '../../truck/shared/truck.model';

@Component({
  selector: 'app-return-order',
  templateUrl: './return-order.component.html',
  styleUrls: ['./return-order.component.scss']
})
export class ReturnOrderComponent implements OnInit {

  jQuery: any;
  allproducts: any[] = [];
  allReturnOrders: any[] = [];
  allUsers: UserModel[] = [];
  currentOrder: OrderModel;
  currentOrderId: number;
  currentIndex: number;
  challanForm: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: Boolean = false;
  orderReturnForm: FormGroup;
  orderStatus: Boolean;
  CSV: File = null;
  fileReader: FileReader = new FileReader();
  parsedCSV;
  showSummary: Boolean = false;
  uploading: Boolean = false;
  submitted: Boolean = false;
  driverIndex:any;
  vehicleIndex:any;
  allVehicle:VehicleModel[]=[];
  alldriver:DriverModel[]=[];
  returnOrderPlacedForm:FormGroup;
  allFarms:any[]=[];
  orderSelected:any=[];
  orderSelectedProducts:any;
  orderSelectedNotes:any;
  orderId:any;
  orderIndex:any;
  challanDriver:any=[];
  challanVehicle:any=[]
  acceptedValueForm:FormGroup;
  recievedValueForm:FormGroup;
  billedValueForm:FormGroup;
  constructor(private productService: ProductsService, private formBuilder: FormBuilder, private toastr: ToastrService,
    private authService: AuthService, private orderService: OrderService, private userService: UserService,private vehicleService:TruckService
  ) {
    this.initForm();
    this.getOrders();
    this.getUsers();
    this.getVehicle();
    this.getDrivers();
    this.getProducts();
    this.getFarms();
  }

  ngOnInit() {
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      dom: "<'html5buttons'B>lTfgitp'",
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
    this.returnOrderPlacedForm = this.formBuilder.group({
      placed_to: ['',Validators.required],
      notes:"",
      products: this.formBuilder.array([])
    })
    this.acceptedValueForm=this.formBuilder.group({
      accepted:this.formBuilder.array([])
    })
    this.challanForm = this.formBuilder.group({
      dispatch_processing_unit: ['', Validators.required],
      
      vehicle: ['', Validators.required],
      driver: ['', Validators.required],  
      departure: ['', Validators.required],
    });
    this.recievedValueForm=this.formBuilder.group({
      recieved:this.formBuilder.array([])
    })
    this.billedValueForm=this.formBuilder.group({
      billed:this.formBuilder.array([])
    })
  }

  onSubmit(){
    // this.submitted = true;
    if (this.returnOrderPlacedForm.invalid) {
      return;
    }
    if(this.returnOrderPlacedForm.value.notes==null){
      this.returnOrderPlacedForm.value.notes=""
    }
    console.log(this.returnOrderPlacedForm.value)
    this.orderService.addReturnOrder(this.returnOrderPlacedForm.value).subscribe((res: ResponseModel) => {
      console.log(res.data);
      jQuery('#modal3').modal('hide');
      this.toastr.success('Order Added!', 'Success!');
      this.allReturnOrders.push(res.data);
      this.resetForm();
  });
    
  }
  get f() { return this.returnOrderPlacedForm.controls; }

  submit() {
    this.submitted = true;
    console.log(this.orderReturnForm.value);
    if (this.orderReturnForm.invalid) {
      return;
    }
    this.currentOrder = this.orderReturnForm.value;
    console.log(this.currentOrder);
    // if (this.editing) {
    //   this.updateOrder(this.currentOrder)
    // } else {
    // this.addOrder(this.orderReturnForm.value);
    // }
  }

  get productsForms() {
    
    return this.returnOrderPlacedForm.get('products') as FormArray;
    
  }

  // get acceptedForms() {
  //   return this.acceptedValueForm.get('accepted') as FormArray;
    
  // }
  addProducts() {

    const product = this.formBuilder.group({ 
      product: [],
      requested: []
    })
  
    this.productsForms.push(product);
  }

  deleteProducts(i) {
    this.productsForms.removeAt(i)
  }

  editProduct(i) {
    this.editing = true;
    this.currentOrder = this.allReturnOrders[i];
    this.currentOrderId = this.allReturnOrders[i]._id;
    this.currentIndex = i;
    this.setFormValue();
  }

  viewSummary(i) {
    this.showSummary = true;
    console.log(i);
    this.currentOrder = this.allReturnOrders[i];
    console.log(this.currentOrder);
  }

  getVehicle() {
    this.vehicleService.getAllVehicles().subscribe((res: ResponseModel) => {
      this.allVehicle = res.data;
    });
  }

  getDrivers() {
    this.vehicleService.alldrivers().subscribe((res: ResponseModel) => {
      this.alldriver = res.data;
      console.log(res.data)
    });
  }

  deleteOrder(i) {
    if (confirm('You Sure you want to delete this Order')) {
      this.orderService.deleteReturnOrder(this.allReturnOrders[i]._id).toPromise().then(() => {
        this.toastr.warning('Products Deleted!', 'Deleted!');
        this.allReturnOrders.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  getProducts() {
    this.allproducts.length = 0;
    this.productService.getAllProduct().subscribe((res: ResponseModel) => {
      this.allproducts = res.data;
      console.log(this.allproducts);
    });
  }

  getUsers() {
    // this.allUsers.length = 0;
    this.userService.getAllUsers().subscribe((res: ResponseModel) => {
      console.log('ALL ORDERS', res);
      this.allUsers = res.data;
      console.log(this.allUsers);
    });
  }

  getFarms(){
    this.orderService.getAllFarms().subscribe((res:ResponseModel)=>{
      this.allFarms=res.data;
      console.log(res.data)
    })
  }
  getOrders() {
    this.allReturnOrders.length = 0;
    this.orderService.getAllReturnOrders().subscribe((res: ResponseModel) => {
        this.allReturnOrders = res.data;
        console.log(res.data);
        this.dtTrigger.next();
    });
  }

  updateOrder() {
    const order = this.currentOrder;
    delete order.order_date;
    delete order.order_id;
    delete order._id;
    const placed_by = order.placed_by._id;
    const placed_to = order.placed_to._id;
    // order.products.forEach(product => {
    //   product.product = product.product._id;
    // });
    console.log('Current Order', this.currentOrder);
    console.log('Placed By', placed_by);
    console.log('placed_to', placed_to);
    order.placed_by = placed_by;
    order.placed_to = placed_to;
    console.log(order);
    this.orderService.updateOrder(order, this.currentOrder._id).subscribe(res => {
      jQuery('#modal3').modal('hide');
      this.toastr.info('Order Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allReturnOrders.splice(this.currentIndex, 1, res);
      this.currentOrderId = null;
      this.editing = false;
    });
  }

  initForm() {
    this.orderReturnForm = this.formBuilder.group({
      placed_to: ['', Validators.required],
      notes:"",
      products: this.formBuilder.array([this.initItemRows()])
    });
  }

  setFormValue() {
    const product = this.allproducts[this.currentIndex];
    this.orderReturnForm.controls['placed_to'].setValue(product.placed_to);
    this.orderReturnForm.controls['products'].setValue(product.products);
  }

  get formArr() {
    return this.orderReturnForm.get('products') as FormArray;
  }

  initItemRows() {
    return this.formBuilder.group({
      // status: true,
      product: [''],
      requested: [''],
      // value: ['']
    });
  }

  addPeriod() {
    this.formArr.push(this.initItemRows());
  }

  removePeriod(i) {
    this.formArr.removeAt(i);
  }

  // public uploadCSV(files: FileList) {
  //   if (files && files.length > 0) {
  //     const file: File = files.item(0);
  //     const reader: FileReader = new FileReader();
  //     reader.readAsText(file);
  //     reader.onload = (e) => {
  //       this.parsedCSV = reader.result;
  //       // let csv = reader.result;
  //       // this.extractData(csv)
  //     };
  //   }
  // }

  // public extractData() {
  //   this.uploading = true;
  //   const lines = this.parsedCSV.split(/\r\n|\n/);
  //   const result = [];
  //   const headers: any[] = lines[0].split(',');
  //   if (headers[0] === 'brand' && headers[1] === 'is_active' && headers[2] === 'cif_price' && headers[3] === 'business_unit'
  //     && headers[4] === 'business_unit_id' && headers[5] === 'distirbutor'
  //     && headers[6] === 'form' && headers[7] === 'notes' && headers[8] === 'pack_size'
  //     && headers[9] === 'promoted' && headers[10] === 'range' && headers[11] === 'registered'
  //     && headers[12] === 'strength' && headers[13] === 'therapy_line_id' && headers[14] === 'therapy_line'
  //     && headers[15] === 'whole_price' && headers[16] === 'sku_id'
  //   ) {
  //     for (let i = 1; i < lines.length - 1; i++) {
  //       const obj = {};
  //       const currentline = lines[i].split(',');
  //       for (let j = 0; j < headers.length; j++) {
  //         obj[headers[j]] = currentline[j];
  //       }
  //       result.push(obj);
  //     }
  //     this.productService.importCustomer(result).subscribe(res => {
  //       setTimeout(() => {
  //         this.uploading = false;
  //         this.toastr.success('Product added successfully', 'Upload Success');
  //         jQuery('#modal2').modal('hide');
  //         this.allproducts.push(res);
  //       }, 1000);
  //     });
  //     // this.newproduct = result;
  //   } else {
  //     this.toastr.error('Try Again', 'Upload Failed');
  //     // this.reset();
  //   }
  // }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.returnOrderPlacedForm.reset();
  }

  generateChallan() {
    this.initChallanForm();
    jQuery('#challanModel').modal('show');
    // for (let index = 0; index < this.currentOrder.products.length; index++) {
    //   this.productsArray.push(this.initItemRows());
    // }
  }

  saveAndAcceptOrder() {
    const updatedOrder = this.currentOrder;
    updatedOrder.status = false;
  }

  // get productsArray() {
  //   return this.challanForm.get('products') as FormArray;
  // }

  initChallanForm() {
    this.challanForm = this.formBuilder.group({
      dispatch_processing_unit: ['', Validators.required],
      products: [''],
      vehicle: ['', Validators.required],
      // vehicle_type: ['', Validators.required],
      driver: ['', Validators.required],
      // driver_mobile: ['', Validators.required],
      // dl_no: ['', Validators.required],
      status:['',  Validators.required],
      departure: ['', Validators.required],
    });
  }

  saveChallan() {
    
    const order2 = <any>new Object();
    order2.products = this.currentOrder.products;
    this.challanForm.get('dispatch_processing_unit').setValue(this.currentOrder.placed_by._id);
    this.challanForm.get('status').setValue(true)
    for (let index = 0; index < this.currentOrder.products.length; index++) {
      order2.products[index].product = order2.products[index].product._id;
      order2.products[index].requested= this.currentOrder.products[index].quantity;
      delete order2.products[index]._id;
      delete order2.products[index].quantity
    }

    
    console.log(order2)
    this.challanForm.get('products').setValue(order2.products);
    const vehicle=this.allVehicle[this.vehicleIndex]
    const driver=this.alldriver[this.driverIndex]
    console.log(this.challanForm.value)
    console.log(driver)
    console.log(vehicle)
    this.orderService.addNewChallan(this.challanForm.value).subscribe((res: ResponseModel) => {
      this.toastr.success('Challan Accepted successfully', 'Accepted');
      console.log(res.data);
      jQuery('#challanModel').modal('hide');
      jQuery('#summaryModel').modal('hide');
    });
  }


  viewAcceptOrderButton(i){
    this.orderSelected=this.allReturnOrders[i];
    console.log(this.orderSelected)
    this.orderSelectedProducts=this.allReturnOrders[i].products;
    this.orderSelectedNotes=this.allReturnOrders[i].notes;
    this.orderId=this.allReturnOrders[i]._id
    this.orderIndex=i;
  }

  asd(event:any,i){
    if(event.target.value){
    var arr=[];
    arr=event.target.value;
    this.acceptedValueForm.value.accepted[i]=arr
    this.qw()
    }
  }

  qw(){
    
    for(var i=0;i<this.acceptedValueForm.value.accepted.length;i++){
      this.orderSelected.products[i].accepted=Number(this.acceptedValueForm.value.accepted[i])
    }
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
    // this.orderService.addAcceptedOrder(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
    //   jQuery('#invoiceModal').modal('hide');
    //   this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
    //   this.allReturnOrders.splice(this.orderIndex,1,res.data)
    // })
  }

  challanGenerate(){
    const date=new Date()
    this.challanForm.controls['vehicle'].setValue(this.challanVehicle._id)
    this.challanForm.controls['driver'].setValue(this.challanDriver._id)
    this.challanForm.controls['departure'].setValue(date)
    this.challanForm.controls['dispatch_processing_unit'].setValue(this.orderSelected.placed_to._id)
    console.log(this.challanForm.value)

    this.orderService.addReturnOrderChallan(this.challanForm.value,this.orderSelected._id).subscribe((res: ResponseModel) => {
      this.toastr.success('Challan Generated successfully', 'Accepted');
      console.log(res.data)
      this.allReturnOrders.splice(this.orderIndex,1,res.data.order)
      jQuery('#invoiceModal').modal('hide');
    });

    
  }
  getDriver(event: any) {
    this.driverIndex = event.target.selectedIndex - 1;
    this.challanDriver=this.alldriver[this.driverIndex]
    console.log(this.challanDriver)
  }
  getVehicle2(event: any) {

    this.vehicleIndex = event.target.selectedIndex - 1;
    this.challanVehicle=this.allVehicle[this.vehicleIndex]
  }

  recievedQuantityEntered(event:any,i){
    var arr;
    arr=event.target.value;
    this.recievedValueForm.value.recieved[i]=arr
    this.qwe();
  }

  qwe(){
    for(var i=0;i<this.recievedValueForm.value.recieved.length;i++){
      this.orderSelected.products[i].recieved=Number(this.recievedValueForm.value.recieved[i])
    }
  
  }

  asdef(){
    const order=<any> new Object();
    order.products=this.orderSelected.products
    for(var i=0;i<this.orderSelected.products.length;i++){
      order.products[i].product=this.orderSelected.products[i].product._id
      delete order.products[i].accepted;
      delete order.products[i].dispatched;
      delete order.products[i].requested;
      delete order.products[i]._id;
      delete order.products[i].billed;
      
    }
    console.log(order,this.orderSelected._id)
    this.orderService.recievedQuantityStatus(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
      jQuery('#invoiceModal').modal('hide');
      this.toastr.success('Recieved Order Challan!', 'Success!');
      this.allReturnOrders.splice(this.orderIndex,1,res.data)
    })
  }

  billedQuantityEntered(event:any,i){
    var arr;
    arr=event.target.value;
    this.billedValueForm.value.billed[i]=arr
    this.billedArray();
  }

  billedArray(){
    for(var i=0;i<this.billedValueForm.value.billed.length;i++){
      this.orderSelected.products[i].billed=Number(this.billedValueForm.value.billed[i])
    }
  }

  billProductQuantity(){
    const order=<any> new Object();
    order.products=this.orderSelected.products
    for(var i=0;i<this.orderSelected.products.length;i++){
      order.products[i].product=this.orderSelected.products[i].product._id
      delete order.products[i].accepted;
      delete order.products[i].dispatched;
      delete order.products[i].recieved;
      delete order.products[i]._id;
      delete order.products[i].requested;
      
    }
    this.orderService.recievedBillStatus(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
      jQuery('#invoiceModal').modal('hide');
      this.allReturnOrders.splice(this.orderIndex,1,res.data)
      this.toastr.success('Billed Challan!', 'Success!');
    })
  }
}
