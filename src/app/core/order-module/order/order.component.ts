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
  currentOrder: ProductModel;
  currentOrderId: number;
  currentIndex: number;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: boolean = false;;
  orderForm: FormGroup;
  CSV: File = null;
  fileReader: FileReader = new FileReader();
  parsedCSV;
  uploading: boolean = false;
  submitted: boolean = false;
  constructor(private productService: ProductsService, private formBuilder: FormBuilder, private toastr: ToastrService,
    private authService: AuthService, private orderService: OrderService, private userService: UserService
  ) {
    this.initForm();
    this.getOrders();
    this.getUsers();
  }

  ngOnInit() {
    this.getProducts();
    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      dom: '<"html5buttons"B>lTfgitp',
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
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
    console.log(this.orderForm.value)
    if (this.orderForm.invalid) {
      return;
    }
    this.currentOrder = this.orderForm.value;
    console.log(this.currentOrder)
    if (this.editing) {
      this.updateOrder(this.currentOrder)
    } else {
      this.addOrder(this.orderForm.value);
    }
  }

  addOrder(order) {
    this.orderService.addOrder(order).subscribe((res: ResponseModel) => {
      if (res.error) {
        this.toastr.warning("Error", res.error)
      } else {
        console.log(res)
        jQuery("#modal3").modal("hide");
        this.toastr.success('Order Added!', 'Success!');
        this.allOrders.push(res.data);
        this.resetForm();
      }
    })
  }

  editProduct(i) {
    this.editing = true;
    this.currentOrder = this.allproducts[i];
    this.currentOrderId = this.allproducts[i]._id;
    this.currentIndex = i;
    this.setFormValue();
  }

  deleteOrder(i) {
    if (confirm("You Sure you want to delete this Order")) {
      this.orderService.deleteOrder(this.allOrders[i]._id).toPromise().then(() => {
        this.toastr.warning('Products Deleted!', 'Deleted!');
        this.allOrders.splice(i, 1)
      }).catch((err) => console.log(err))
    }
  }

  getProducts() {
    this.allproducts.length = 0;
    this.productService.getAllProduct().subscribe((res: ProductModel[]) => {
      this.allproducts = res;
      console.log(this.allproducts)
      this.dtTrigger.next();
    })
  }

  getUsers() {
    this.allUsers.length = 0;
    this.userService.getAllUsers().subscribe((res: ResponseModel) => {
      console.log(res)
      if (res.error) {
        this.toastr.warning('Error', res.error)
      } else {
        this.allUsers = res.data;
        console.log(this.allUsers)
      }
    })
  }

  getOrders() {
    this.allOrders.length = 0;
    this.orderService.getAllOrders().subscribe((res: ResponseModel) => {
      console.log(res)
      if (res.error) {
        this.toastr.warning('Error', res.error)
      } else {
        this.allOrders = res.data;
        console.log(this.allOrders)
        this.dtTrigger.next();
      }
    })
  }


  updateOrder(order) {
    let id = this.allOrders[this.currentIndex]._id;
    order._id = id;
    console.log(order);
    this.orderService.updateOrder(order).subscribe(res => {
      jQuery("#modal3").modal("hide");
      this.toastr.info('Order Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allOrders.splice(this.currentIndex, 1, res)
      this.currentOrderId = null;
      this.editing = false;
    })
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      placed_by: ['', Validators],
      placed_to: ['', Validators.required],
      products: this.formBuilder.array([this.initItemRows()])
    })
  }

  setFormValue() {
    var product = this.allproducts[this.currentIndex];
    this.orderForm.controls['placed_by'].setValue(product.placed_by);
    this.orderForm.controls['placed_to'].setValue(product.placed_to);
    this.orderForm.controls['products'].setValue(product.products);
  }

  get formArr() {
    return this.orderForm.get('products') as FormArray;
  }

  initItemRows() {
    return this.formBuilder.group({
      product: [''],
      quantity: [''],
      // value: ['']
    });
  }

  addPeriod() {
    this.formArr.push(this.initItemRows())
  }

  removePeriod(i) {
    this.formArr.removeAt(i);
  }

  public uploadCSV(files: FileList) {
    if (files && files.length > 0) {
      let file: File = files.item(0);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.parsedCSV = reader.result;
        // let csv = reader.result;
        // this.extractData(csv)
      }
    }
  }

  public extractData() {
    this.uploading = true;
    var lines = this.parsedCSV.split(/\r\n|\n/);
    var result = [];
    var headers: any[] = lines[0].split(",");
    if (headers[0] == "brand" && headers[1] == "is_active" && headers[2] == "cif_price" && headers[3] == "business_unit"
      && headers[4] == "business_unit_id" && headers[5] == "distirbutor"
      && headers[6] == "form" && headers[7] == "notes" && headers[8] == "pack_size"
      && headers[9] == "promoted" && headers[10] == "range" && headers[11] == "registered"
      && headers[12] == "strength" && headers[13] == "therapy_line_id" && headers[14] == "therapy_line"
      && headers[15] == "whole_price" && headers[16] == "sku_id"
    ) {
      for (var i = 1; i < lines.length - 1; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      this.productService.importCustomer(result).subscribe(res => {
        setTimeout(() => {
          this.uploading = false;
          this.toastr.success('Product added successfully', 'Upload Success');
          jQuery("#modal2").modal("hide");
          this.allproducts.push(res);
        }, 1000);
      });
      // this.newproduct = result;
    }
    else {
      this.toastr.error('Try Again', 'Upload Failed')
      // this.reset();
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.orderForm.reset();
  }
}
