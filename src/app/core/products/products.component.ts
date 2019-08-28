import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ProductsService } from './shared/products.service';
import { FormBuilder, FormGroup, FormControlName, Validators } from '@angular/forms';
import { ProductModel, CategoryModel, category } from './shared/product.model';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ResponseModel } from '../../shared/shared.model';
import * as _ from "lodash";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  @ViewChildren("selectallcheckboxes") selectallcheckboxes: QueryList<ElementRef>;
  @ViewChildren("selectallcheckboxes") selectallcheckboxes2: any;
  @ViewChildren("checkboxes") checkboxes2:any;;
  jQuery: any;
  allproducts: ProductModel[] = [];
  allCategories: CategoryModel[] = [];
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
  viewArray: any = [];
  allBrand:any[]=[];
  allHub:any[]=[];
  array:any[]=[];
  countArray:any[]=[];
  array2:any=[];
  array3:any[]=[];
  masterArray:any[]=[]
  constructor(private productService: ProductsService, private formBuilder: FormBuilder, private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.getProducts();
    this.getAllCategory();
    this.getallBrand();
    this.getAllHub();
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
    this.productForm = this.formBuilder.group({
      available_for: this.formBuilder.array([]),
      brand: ['', Validators.required],
      category: ['', Validators.required],
      details: [''],
      farm_price: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
      // image: ['No Value', Validators.required],
      is_active: [false],
      name: ['', Validators.required],
      // product_dms: ['', Validators.required],
      selling_price: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
    });
  }


  get f() { return this.productForm.controls; }

  submit() {
  
    this.submitted = true;
  if (this.productForm.invalid) {
    return;
  }

  if(this.editing){
      this.productForm.value.available_for.length=0;
    for(var i=0;i<this.checkboxes2._results.length;i++){
      if(this.checkboxes2._results[i].nativeElement.checked==true){
          this.productForm.value.available_for.push(this.allHub[i]._id)
      }
    }
    this.updateProduct(this.productForm.value);
  }else{
    for(var i=0;i<this.checkboxes2._results.length;i++){
      if(this.checkboxes2._results[i].nativeElement.checked==true){
          this.productForm.value.available_for.push(this.allHub[i]._id)
      }
    }
    this.addProduct(this.productForm.value)
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

  selectAllCheckboxes(){
    if(this.selectallcheckboxes2._results[0].nativeElement.checked==true){
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = true;
    });
  }

  if(this.selectallcheckboxes2._results[0].nativeElement.checked==false){
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }
  
  }

  editProduct(i) {
    this.editing = true;
    this.currentproduct = this.allproducts[i];
    this.currentproductId = this.allproducts[i]._id;
    this.currentIndex = i;
    this.masterArray.length=0
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
    this.setFormValue();
  }

  viewProduct(i) {
    this.array3.length=0
    this.viewArray = this.allproducts[i];
    console.log(this.viewArray);
      for(let i=0;i<this.viewArray.available_for.length;i++){
        this.array3.push(this.viewArray.available_for[i])
      }
      console.log(this.array3)
      if(this.array3.length>0){
      jQuery('#exampleModal').modal('show')
      }
      
  }

  getAllCategory() {
    this.productService.getAllCategory().subscribe((res: ResponseModel) => {
      this.allCategories = res.data
      console.log(res.data)
      this.dtTrigger.next();
    })
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

  getallBrand(){
    this.productService.getAllBrand().subscribe((res: ResponseModel) => {
      console.log(res);
      this.allBrand = res.data;
      console.log(this.allBrand);
      this.dtTrigger.next();
    });
    }

    getAllHub(){
      this.productService.getAllHub().subscribe((res: ResponseModel) => {
        console.log(res);
        this.allHub = res.data;
        console.log(this.allHub);
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
      console.log(res.data)
      this.allproducts.splice(this.currentIndex, 1, res.data)
      this.currentproductId = null;
      this.editing = false;
      this.masterArray.length=0;
      this.checkboxes.forEach((element) => {
        element.nativeElement.checked = false;
      });
    });
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      available_for: ['', Validators.required],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      details: [''],
      farm_price: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
      // image: ['No Value', Validators.required],
      is_active: [true],
      name: ['', Validators.required],
      product_dms: ['', Validators.required],
      selling_price: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
    });
  }

  setFormValue() {
    
    var available:any=this.currentproduct.available_for;
    console.log(available)
    for(let i=0;i<available.length;i++){
      let a=available[i]._id
      for(var j=0;j<this.allHub.length;j++){
        if(a==this.allHub[j]._id){
          console.log(j)
          this.checkboxes2._results[j].nativeElement.checked=true;
        }
      }
    }
    for(var i=0;i<this.checkboxes2._results.length;i++){
      console.log(this.checkboxes2._results[i].nativeElement.checked)
    }
    const product: any = this.allproducts[this.currentIndex];
    console.log(product)
    this.productForm.controls['brand'].setValue(product.brand._id);

    this.productForm.controls['category'].setValue(product.category._id);
    this.productForm.controls['details'].setValue(product.details);
    this.productForm.controls['farm_price'].setValue(product.farm_price);
    this.productForm.controls['is_active'].setValue(product.is_active);
    this.productForm.controls['name'].setValue(product.name);
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
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
    this.selectallcheckboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }
}
