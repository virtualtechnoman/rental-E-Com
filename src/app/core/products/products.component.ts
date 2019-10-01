import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ProductsService } from './shared/products.service';
import { FormBuilder, FormGroup, FormControlName, Validators } from '@angular/forms';
import { ProductModel, CategoryModel } from './shared/product.model';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ResponseModel } from '../../shared/shared.model';
import * as _ from 'lodash';
import value from '*.json';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  @ViewChildren('selectallcheckboxes') selectallcheckboxes: QueryList<ElementRef>;
  @ViewChildren('selectallcheckboxes') selectallcheckboxes2: any;
  @ViewChildren('checkboxes') checkboxes2: any;
  fileSelected: any;
  imageUrl = 'https://sgsmarketing.s3.ap-south-1.amazonaws.com/'
  jQuery: any;
  allproducts: any[] = [];
  allCategories: CategoryModel[] = [];
  allTherapies: any[] = [];
  all_business_unit: any[] = [];
  currentproduct: ProductModel;
  currentproductId: String;
  currentIndex: number;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: Boolean = false;
  productForm: FormGroup;
  AttributeValueForm: FormGroup;
  CSV: File = null;
  fileReader: FileReader = new FileReader();
  parsedCSV;
  uploading: Boolean = false;
  submitted: Boolean = false;
  viewArray: any = [];
  allBrand: any[] = [];
  allHub: any[] = [];
  array: any[] = [];
  countArray: any[] = [];
  array2: any = [];
  array3: any[] = [];
  masterArray: any[] = [];
  keyProductImage: any;
  urlProductImage: any;
  showImage: Boolean = false;
  image: any;
  editShowImage: Boolean = false;
  editImage: any;
  mastImage: any;
  productImagesArray: any[] = [];
  specificCategoryAttributes: any[] = [];
  specificCategoryAttributesLength: any;
  specificCategoryAttributesName: any = [];
  editAttributesArray: any = [];
  newStock: Number;
  pattern = "^[0-9]*$";
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
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      // dom: "<'html5buttons'B>lTfgitp",
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      }, initComplete: function (settings, json) {
        $('.button').removeClass('dt-button');
      },
      dom: "l  f r t i p",
      // dom:"B<'#colvis row'><'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>",
      // buttons: [
      //   {
      //     text: 'Excel',
      //     extend: 'excel',
      //     className: 'table-button btn btn-sm button btn-danger '
      //   },
      //   {
      //     extend: 'print',
      //     text: 'Print',
      //     className: 'table-button btn-sm button btn btn-danger '
      //   },
      //   {
      //     extend: 'pdf',
      //     text: 'PDF',
      //     className: 'table-button btn-sm button btn btn-danger '
      //   }
      // ]
    };
    this.productForm = this.formBuilder.group({
      available_for: this.formBuilder.array([]),
      brand: ['', Validators.required],
      category: ['', Validators.required],
      details: [''],
      // farm_price: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
      attributes: this.formBuilder.array([]),
      is_active: [false],
      name: ['', Validators.required],
      selling_price: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
      image: ['']
    });
    this.AttributeValueForm = this.formBuilder.group({
      values: this.formBuilder.array([
      ])
    })
    console.log(this.AttributeValueForm.value)
  }


  get f() { return this.productForm.controls; }

  selectFile(event: any) {
    this.fileSelected = event.target.files[0];
    console.log(this.fileSelected)
  }

  submit() {
    console.log(this.specificCategoryAttributesName);
    const attributes: any[] = [];
    if (this.specificCategoryAttributesLength) {
      for (var index = 0; index < this.specificCategoryAttributesLength; index++) {
        if (!this.AttributeValueForm.value.values[index]) {
          this.AttributeValueForm.value.values[index] = ''
        }
        attributes[index] = { name: this.specificCategoryAttributesName[index], value: this.AttributeValueForm.value.values[index] }
      }
    }
    if (attributes) {
      this.productForm.value.attributes = attributes
    }


    console.log(this.productForm.value)
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }

    if (this.editing) {
      this.productForm.value.available_for.length = 0;
      for (var i = 0; i < this.checkboxes2._results.length; i++) {
        if (this.checkboxes2._results[i].nativeElement.checked == true) {
          this.productForm.value.available_for.push(this.allHub[i]._id)
        }
      }
      // this.updateProduct(this.productForm.value);
    } else {
      for (var i = 0; i < this.checkboxes2._results.length; i++) {
        if (this.checkboxes2._results[i].nativeElement.checked == true) {
          this.productForm.value.available_for.push(this.allHub[i]._id)
        }
      }
    }
    if (this.fileSelected) {
      this.productService.getUrlProduct().subscribe((res: ResponseModel) => {
        console.log(res.data)
        this.keyProductImage = res.data.key;
        this.urlProductImage = res.data.url;

        if (this.urlProductImage) {
          this.productService.sendUrlProduct(this.urlProductImage, this.fileSelected).then(resp => {
            if (resp.status === 200) {
              this.productForm.value.image = this.keyProductImage;

              console.log(this.productForm.value);
              if (this.editing) {
                this.updateProduct(this.productForm.value);
              } else {
                this.addProduct(this.productForm.value);
              }
            }
          })
        }
      })
    } else {
      console.log(this.productForm.value);
      if (this.editing) {
        if (!this.fileSelected) {
          this.productForm.value.image = this.mastImage;
        }
        console.log(this.mastImage);
        this.updateProduct(this.productForm.value);

      } else {
        delete this.productForm.value.image;
        this.addProduct(this.productForm.value);
      }
    }
  }

  addProduct(product) {
    console.log(product);
    if (product) {
      this.productService.addProduct(product).subscribe((res: ResponseModel) => {
        jQuery('#modal3').modal('hide');
        this.toastr.success('Product Added!', 'Success!');
        this.allproducts.push(res.data);
        this.resetForm();
      });
    }
  }

  selectAllCheckboxes() {
    if (this.selectallcheckboxes2._results[0].nativeElement.checked === true) {
      this.checkboxes.forEach((element) => {
        element.nativeElement.checked = true;
      });
    }

    if (this.selectallcheckboxes2._results[0].nativeElement.checked == false) {
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
    if (this.allproducts[i].attributes) {
      this.editAttributesArray = this.allproducts[i].attributes;
    }
    console.log(this.editAttributesArray);
    this.masterArray.length = 0;
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
    this.setFormValue();
  }

  viewProduct(i) {
    this.array3.length = 0;
    this.viewArray = this.allproducts[i];
    if (this.viewArray.image) {
      this.showImage = true;
      this.image = this.imageUrl + this.viewArray.image;
      console.log(this.image);
    } else {
      this.showImage = false;
    }
    console.log(this.viewArray);
    for (let i = 0; i < this.viewArray.available_for.length; i++) {
      this.array3.push(this.viewArray.available_for[i]);
    }
    console.log(this.array3)
    if (this.array3.length > 0) {
      jQuery('#exampleModal').modal('show')
    }

  }

  getAllCategory() {
    this.productService.getAllCategory().subscribe((res: ResponseModel) => {
      this.allCategories = res.data;
      console.log(res.data);
    });
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
      this.allproducts = res.data;
      this.dtTrigger.next();
      if (res.data) {
        for (var i = 0; i < res.data.length; i++) {
          this.productImagesArray.push(this.imageUrl + res.data[i].image);
        }
      }
    });
  }
  getallBrand() {
    this.productService.getAllBrand().subscribe((res: ResponseModel) => {
      this.allBrand = res.data;
    });
  }

  getAllHub() {
    this.productService.getAllHub().subscribe((res: ResponseModel) => {
      console.log(res);
      this.allHub = res.data;
    });
  }

  updateProduct(product) {
    const id = this.allproducts[this.currentIndex]._id;
    if (this.editAttributesArray) {
      product.attributes = this.editAttributesArray
    }
    if (id) {
      this.productService.updateProduct(product, id).subscribe((res: ResponseModel) => {
        jQuery('#modal3').modal('hide');
        this.toastr.info('Product Updated Successfully!', 'Updated!!');
        this.resetForm();
        this.allproducts.splice(this.currentIndex, 1, res.data)
        this.currentproductId = null;
        this.editing = false;
        this.masterArray.length = 0;
        this.checkboxes.forEach((element) => {
          element.nativeElement.checked = false;
        });
      });
    }
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      available_for: ['', Validators.required],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      details: [''],
      // farm_price: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
      // image: ['No Value', Validators.required],
      is_active: [true],
      name: ['', Validators.required],
      product_dms: ['', Validators.required],
      selling_price: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
    });
  }

  setFormValue() {

    const available: any = this.currentproduct.available_for;
    console.log(available);
    for (let i = 0; i < available.length; i++) {
      const a = available[i]._id;
      for (let j = 0; j < this.allHub.length; j++) {
        if (a === this.allHub[j]._id) {
          this.checkboxes2._results[j].nativeElement.checked = true;
        }
      }
    }
    for (let i = 0; i < this.checkboxes2._results.length; i++) {
      console.log(this.checkboxes2._results[i].nativeElement.checked);
    }
    const product: any = this.allproducts[this.currentIndex];
    this.productForm.controls['brand'].setValue(product.brand._id);
    this.productForm.controls['category'].setValue(product.category._id);
    this.productForm.controls['details'].setValue(product.details);
    // this.productForm.controls['farm_price'].setValue(product.farm_price);
    this.productForm.controls['is_active'].setValue(product.is_active);
    this.productForm.controls['name'].setValue(product.name);
    this.productForm.controls['selling_price'].setValue(product.selling_price);
    if (product.image) {
      this.editShowImage = true;
      this.mastImage = product.image;
      this.editImage = this.imageUrl + product.image;
      // this.VehicleForm.controls['image'].setValue(image);
      console.log(this.editImage);
    } else {
      this.editShowImage = false;
    }

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
      this.productService.importCustomer(result).subscribe((res: ResponseModel) => {
        setTimeout(() => {
          this.uploading = false;
          this.toastr.success('Product added successfully', 'Upload Success');
          jQuery('#modal2').modal('hide');
          this.allproducts.push(res.data);
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
    this.productForm.reset();
    this.editShowImage = false;
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
    this.selectallcheckboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  getCategoryAttributes(event) {
    this.specificCategoryAttributes.length = 0;
    if (event.target.selectedIndex !== 0) {
      const id = this.allCategories[event.target.selectedIndex - 1]._id;
      if (id) {
        this.productService.getAllAttributeSpecificCategory(id).subscribe((res: ResponseModel) => {
          console.log(res.data);
          if (res.data) {
            this.specificCategoryAttributes = res.data[0];
            this.specificCategoryAttributesName = res.data[0].name;
            this.specificCategoryAttributesLength = res.data[0].name.length;
          }
        });
      }
    }
  }

  updateProductStock() {
    this.productService.updateProductStock({ id: this.currentproduct._id, newStock: this.newStock }).subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.error) {
        this.toastr.warning('Error', 'Stock Not Updated');
      } else {
        this.allproducts.splice(this.currentIndex, 1, res.data);
        this.toastr.success('Updated', 'Stock Updated');
        jQuery('#stockModal').modal('hide');
        this.newStock = 0;
      }
    });
  }
}
