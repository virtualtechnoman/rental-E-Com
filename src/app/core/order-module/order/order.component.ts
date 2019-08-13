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

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  jQuery: any;
  allproducts: any[] = [];
  allOrders: any[] = [];
  allUsers: any[] = [];
  currentOrder: OrderModel;
  currentOrderId: number;
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
  constructor(private productService: ProductsService, private formBuilder: FormBuilder, private toastr: ToastrService,
    private authService: AuthService, private orderService: OrderService, private userService: UserService
  ) {
    this.initForm();
    this.initChallanForm();
    this.getOrders();
    this.getUsers();
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

  get f() { return this.orderForm.controls; }

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

  addOrder(order) {
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

  editProduct(i) {
    this.editing = true;
    this.currentOrder = this.allOrders[i];
    this.currentOrderId = this.allOrders[i]._id;
    this.currentIndex = i;
    this.setFormValue();
  }

  viewSummary(i) {
    while (this.valueArr.length !== 0) { this.valueArr.removeAt(0); }
    this.showSummary = true;
    this.currentOrder = this.allOrders[i];
    for (let index = 0; index < this.currentOrder.products.length; index++) {
      this.valueArr.push(this.initValueRows());
    }
    for (let index = 0; index < this.valueArr.length; index++) {
      this.valueArr.controls[index].get('accepted').setValue(this.currentOrder.products[index].accepted);
    }
  }

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
    this.productService.getAllProduct().subscribe((res: ProductModel[]) => {
      this.allproducts = res;
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

  updateOrder() {
    const placed_to = this.currentOrder.placed_to._id;
    const order2 = <any>new Object();
    order2.status = true;
    order2.placed_to = placed_to;
    delete order2._id; delete order2.placed_by; delete order2.order_date;
    order2.products = this.currentOrder.products;
    for (let index = 0; index < this.currentOrder.products.length; index++) {
      order2.products[index].product = order2.products[index].product._id;
      delete order2.products[index]._id;
      order2.products[index].accepted = this.valueArr.value[index].accepted;
    }
    this.orderForm.get('status').setValue(true);
    console.log('Sent Order', order2);
    this.updatedOrder = order2;
    this.orderService.updateOrder(order2, this.currentOrder._id).subscribe((res: ResponseModel) => {
      jQuery('#summaryModel').modal('hide');
      this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
      this.resetForm();
      this.allOrders.splice(this.currentIndex, 1, res.data);
      // this.currentOrderId = null;
      this.editing = false;
    });
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      status: [''],
      placed_to: ['', Validators.required],
      notes: [''],
      products: this.formBuilder.array([this.initItemRows()])
    });
    this.valueForm = this.formBuilder.group({
      productsArray: this.formBuilder.array([])
    });
  }

  setFormValue() {
    const product = this.allproducts[this.currentIndex];
    this.orderForm.controls['placed_to'].setValue(product.placed_to);
    this.orderForm.controls['products'].setValue(product.products);
    this.orderForm.controls['notes'].setValue(product.notes);
  }

  get formArr() {
    return this.orderForm.get('products') as FormArray;
  }

  get valueArr() {
    return this.valueForm.get('productsArray') as FormArray;
  }

  initItemRows() {
    return this.formBuilder.group({
      accepted: [''],
      product: [''],
      quantity: [''],
      // value: ['']
    });
  }

  initValueRows(): FormGroup {
    return this.formBuilder.group({
      accepted: [''],
      // value: ['']
    });
  }


  addPeriod() {
    this.formArr.push(this.initItemRows());
  }

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
          this.allproducts.push(res);
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
    this.orderForm.reset();
  }

  generateChallan() {
    jQuery('#challanModel').modal('show');
    for (let index = 0; index < this.currentOrder.products.length; index++) {
      this.productsArray.push(this.initItemRows());
    }
  }

  saveAndAcceptOrder() {
    const updatedOrder = this.currentOrder;
    updatedOrder.status = false;
  }
  get productsArray() {
    return this.challanForm.get('products') as FormArray;
  }

  initChallanForm() {
    this.challanForm = this.formBuilder.group({
      dispatch_processing_unit: ['', Validators.required],
      // products: this.formBuilder.array([this.initItemRows()]),
      products: [''],
      vehicle_no: ['', Validators.required],
      vehicle_type: ['', Validators.required],
      driver_name: ['', Validators.required],
      driver_mobile: ['', Validators.required],
      dl_no: ['', Validators.required],
      departure: ['', Validators.required],
    });
  }

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
    console.log(order2);
    this.challanForm.get('dispatch_processing_unit').setValue(this.currentOrder.placed_to._id);
    this.challanForm.get('products').setValue(this.currentOrder.products);
    console.log(this.challanForm.value);
    this.orderForm.get('status').setValue(true);
    this.orderService.addNewChallan(this.challanForm.value).subscribe((res: ResponseModel) => {
      this.toastr.success('Challan Accepted successfully', 'Accepted');
      console.log(res.data)
    });
  }

}
