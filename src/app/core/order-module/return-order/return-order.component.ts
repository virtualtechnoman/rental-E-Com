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
  constructor(private productService: ProductsService, private formBuilder: FormBuilder, private toastr: ToastrService,
    private authService: AuthService, private orderService: OrderService, private userService: UserService,private vehicleService:TruckService
  ) {
    this.initForm();
    this.getOrders();
    this.getUsers();
    this.getVehicle();
    this.getDrivers();
  }

  ngOnInit() {
    this.getProducts();
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
  }

  get f() { return this.orderReturnForm.controls; }

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
    this.orderReturnForm.removeControl('products.accepted');
    this.addOrder(this.orderReturnForm.value);
    // }
  }

  addOrder(order) {
    // console.log(order)
    // this.orderReturnForm.get('status').setValue(true);
    order.status=true;
    console.log(order)
    this.orderService.addReturnOrder(order).subscribe((res: ResponseModel) => {
      if (res.error) {
        this.toastr.warning('Error', res.error);
      } else {
        console.log(res);
        jQuery('#modal3').modal('hide');
        this.toastr.success('Order Added!', 'Success!');
        this.allReturnOrders.push(res.data);
        this.resetForm();
      }
    });
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

  getVehicle(){
    this.vehicleService.getAllVehicles().subscribe((res:ResponseModel)=>{
        this.allVehicle=res.data
        console.log(res.data)
    })
  }

  getDrivers(){
    this.vehicleService.getAllDrivers().subscribe((res:ResponseModel)=>{
      this.alldriver=res.data
      console.log(res.data)
    })
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
    this.productService.getAllProduct().subscribe((res: ProductModel[]) => {
      this.allproducts = res;
      console.log(this.allproducts);
      this.dtTrigger.next();
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

  getOrders() {
    this.allReturnOrders.length = 0;
    this.orderService.getAllReturnOrders().subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.error) {
        this.toastr.warning('Error', res.error);
      } else {
        this.allReturnOrders = res.data;
        console.log(this.allReturnOrders);
        this.dtTrigger.next();
      }
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
      status: [false],
      placed_to: ['', Validators.required],
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
      quantity: [''],
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
    this.orderReturnForm.reset();
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
  getDriver(event:any){
    this.driverIndex=event.target.selectedIndex-1
    console.log(this.driverIndex)
  }
  getVehicle2(event:any){
    
    this.vehicleIndex=event.target.selectedIndex-1
    console.log(this.vehicleIndex)
  }
}
