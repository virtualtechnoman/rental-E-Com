import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ProductModel } from '../../products/shared/product.model';
import { AuthService } from '../../../auth/auth.service';
import { ProductsService } from '../../products/shared/products.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

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
    private authService: AuthService
  ) {
    this.initForm();
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
    this.orderForm.get('image').setValue("ASD");
    this.orderForm.get('created_by').setValue("ASD");
    console.log(this.orderForm.value)
    if (this.orderForm.invalid) {
      return;
    }
    this.currentOrder = this.orderForm.value;
    console.log(this.currentOrder)
    if (this.editing) {
      this.updateProduct(this.currentOrder)
    } else {
      this.addProduct(this.orderForm.value);
    }
  }

  addProduct(product) {
    this.productService.addProduct(product).subscribe(res => {
      jQuery("#modal3").modal("hide");
      this.toastr.success('Product Added!', 'Success!');
      this.allproducts.push(res);
      this.resetForm();
    })
  }

  editProduct(i) {
    this.editing = true;
    this.currentOrder = this.allproducts[i];
    this.currentOrderId = this.allproducts[i]._id;
    this.currentIndex = i;
    this.setFormValue();
  }

  deleteProduct(i) {
    if (confirm("You Sure you want to delete this Product")) {
      this.productService.deleteProduct(this.allproducts[i]._id).toPromise().then(() => {
        this.toastr.warning('Products Deleted!', 'Deleted!');
        this.allproducts.splice(i, 1)
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


  updateProduct(product) {
    let id = this.allproducts[this.currentIndex]._id;
    product._id = id;
    console.log(product);
    this.productService.updateProduct(product).subscribe(res => {
      jQuery("#modal3").modal("hide");
      this.toastr.info('Product Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allproducts.splice(this.currentIndex, 1, res)
      this.currentOrderId = null;
      this.editing = false;
    })
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      available_for: ['', Validators.required],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      created_by: ['No Value', Validators.required],
      details: [''],
      farm_price: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(1)]],
      image: ['No Value', Validators.required],
      is_active: [true],
      name: ['', Validators.required],
      product_id: ['', Validators.required],
      product_dms: ['', Validators.required],
      selling_price: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(1)]],
    })
  }

  setFormValue() {
    var product = this.allproducts[this.currentIndex];
    this.orderForm.controls['available_for'].setValue(product.available_for);
    this.orderForm.controls['brand'].setValue(product.brand);
    this.orderForm.controls['category'].setValue(product.category);
    this.orderForm.controls['created_by'].setValue(product.created_by);
    this.orderForm.controls['details'].setValue(product.details);
    this.orderForm.controls['farm_price'].setValue(product.farm_price);
    this.orderForm.controls['image'].setValue(product.image);
    this.orderForm.controls['is_active'].setValue(product.is_active);
    this.orderForm.controls['name'].setValue(product.name);
    this.orderForm.controls['product_id'].setValue(product.product_id);
    this.orderForm.controls['product_dms'].setValue(product.product_dms);
    this.orderForm.controls['selling_price'].setValue(product.selling_price);
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
