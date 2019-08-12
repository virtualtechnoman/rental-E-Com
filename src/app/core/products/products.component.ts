import { Component, OnInit } from '@angular/core';
import { ProductsService } from './shared/products.service';
import { FormBuilder, FormGroup, FormControlName, Validators } from '@angular/forms';
import { ProductModel } from './shared/product.model';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ResponseModel } from '../../shared/shared.model';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  jQuery: any;
  allproducts: ProductModel[] = [];
  allTherapies: any[] = [];
  all_business_unit: any[] = [];
  currentproduct: ProductModel;
  currentproductId: String;
  currentIndex: number;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: Boolean = false;;
  productForm: FormGroup;
  CSV: File = null;
  fileReader: FileReader = new FileReader();
  parsedCSV;
  uploading: Boolean = false;
  submitted: Boolean = false;
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

  get f() { return this.productForm.controls; }

  submit() {
    this.submitted = true;
    console.log(this.productForm.value);
    if (this.productForm.invalid) {
      return;
    }
    this.currentproduct = this.productForm.value;
    console.log(this.currentproduct);
    if (this.editing) {
      this.updateProduct(this.currentproduct);
    } else {
      this.addProduct(this.productForm.value);
    }
  }

  addProduct(product) {
    this.productService.addProduct(product).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.success('Product Added!', 'Success!');
      this.allproducts.push(res.data);
      this.resetForm();
    })
  }

  editProduct(i) {
    this.editing = true;
    this.currentproduct = this.allproducts[i];
    this.currentproductId = this.allproducts[i]._id;
    this.currentIndex = i;
    this.setFormValue();
  }

  deleteProduct(i) {
    if (confirm('You Sure you want to delete this Product')) {
      this.productService.deleteProduct(this.allproducts[i]._id).toPromise().then(() => {
        this.toastr.warning('Products Deleted!', 'Deleted!');
        this.allproducts.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  getProducts() {
    this.allproducts.length = 0;
    this.productService.getAllProduct().subscribe((res: ResponseModel) => {
      console.log(res);
      this.allproducts = res.data;
      console.log(this.allproducts);
      this.dtTrigger.next();
    });
  }


  updateProduct(product) {
    const id = this.allproducts[this.currentIndex]._id;
    // product._id = id;
    console.log(product);
    this.productService.updateProduct(product, id).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.info('Product Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allproducts.splice(this.currentIndex, 1, res.data)
      this.currentproductId = null;
      this.editing = false;
    });
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      available_for: ['', Validators.required],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      // created_by: ['No Value', Validators.required],
      details: [''],
      farm_price: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
      // image: ['No Value', Validators.required],
      is_active: [true],
      name: ['', Validators.required],
      // product_id: ['', Validators.required],
      product_dms: ['', Validators.required],
      selling_price: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
    });
  }

  setFormValue() {
    const product = this.allproducts[this.currentIndex];
    this.productForm.controls['available_for'].setValue(product.available_for);
    this.productForm.controls['brand'].setValue(product.brand);
    this.productForm.controls['category'].setValue(product.category);
    // this.productForm.controls['created_by'].setValue(product.created_by);
    this.productForm.controls['details'].setValue(product.details);
    this.productForm.controls['farm_price'].setValue(product.farm_price);
    // this.productForm.controls['image'].setValue(product.image);
    this.productForm.controls['is_active'].setValue(product.is_active);
    this.productForm.controls['name'].setValue(product.name);
    // this.productForm.controls['product_id'].setValue(product.product_id);
    this.productForm.controls['product_dms'].setValue(product.product_dms);
    this.productForm.controls['selling_price'].setValue(product.selling_price);
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
      }
    }
  }

  public extractData() {
    this.uploading = true;
    const lines = this.parsedCSV.split(/\r\n|\n/);
    const result = [];
    const headers: any[] = lines[0].split(",");
    if (headers[0] == "brand" && headers[1] == "is_active" && headers[2] == "cif_price" && headers[3] == "business_unit"
      && headers[4] == "business_unit_id" && headers[5] == "distirbutor"
      && headers[6] == "form" && headers[7] == "notes" && headers[8] == "pack_size"
      && headers[9] == "promoted" && headers[10] == "range" && headers[11] == "registered"
      && headers[12] == "strength" && headers[13] == "therapy_line_id" && headers[14] == "therapy_line"
      && headers[15] == "whole_price" && headers[16] == "sku_id"
    ) {
      for (var i = 1; i < lines.length - 1; i++) {
        const obj = {};
        const currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      this.productService.importCustomer(result).subscribe((res: ResponseModel) => {
        setTimeout(() => {
          this.uploading = false;
          this.toastr.success('Product added successfully', 'Upload Success');
          jQuery("#modal2").modal("hide");
          this.allproducts.push(res.data);
        }, 1000);
      });
      // this.newproduct = result;
    } else {
      this.toastr.error('Try Again', 'Upload Failed')
      // this.reset();
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.productForm.reset();
  }
}
