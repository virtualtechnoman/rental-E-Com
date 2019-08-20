import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryModel } from '../shared/product.model';
import { Subject } from 'rxjs';
import { ProductsService } from '../shared/products.service';
import { ResponseModel } from '../../../shared/shared.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryForm: FormGroup;
    submitted = false;
    editing:boolean=false;
    currentcategory:CategoryModel;
    dtOptions: any = {};
  currentcategoryId: String;
  currentIndex: number;
  dtTrigger: Subject<any> = new Subject();
  allCategory:CategoryModel[]=[];
  viewArray:any=[]
  constructor(private formBuilder:FormBuilder,private productService:ProductsService, private toastr:ToastrService) { 
    this.initForm();
  }

  ngOnInit() {
    this.getCategory();
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
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      is_active: ['', Validators.required]
  });
  }
  get f() { return this.categoryForm.controls; }
  submit() {
    this.submitted = true;
    console.log(this.categoryForm.value);
    if (this.categoryForm.invalid) {
      return;
    }
    this.currentcategory = this.categoryForm.value;
    console.log(this.currentcategory);
    if (this.editing) {
      this.updateCategory(this.currentcategory);
    } else {
      this.addCategory(this.categoryForm.value);
    }
  }

  addCategory(category) {
    this.productService.addCategory(category).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.success('Product Added!', 'Success!');
      this.allCategory.push(res.data);
      this.resetForm();
    })
  }

  viewCategory(i){
    this.viewArray=this.allCategory[i];
  }

  editCategory(i) {
    this.editing = true;
    this.currentcategory = this.allCategory[i];
    this.currentcategoryId = this.allCategory[i]._id;
    this.currentIndex = i;
    this.setFormValue();
  }

  deleteCategory(i) {
    if (confirm('You Sure you want to delete this Product')) {
      this.productService.deleteCategory(this.allCategory[i]._id).toPromise().then(() => {
        this.toastr.warning('Products Deleted!', 'Deleted!');
        this.allCategory.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  getCategory() {
    this.allCategory.length = 0;
    this.productService.getAllCategory().subscribe((res: ResponseModel) => {
      console.log(res);
      this.allCategory = res.data;
      console.log(this.allCategory);
      this.dtTrigger.next();
    });
  }


  updateCategory(category) {
    const id = this.allCategory[this.currentIndex]._id;
    // product._id = id;
    console.log(category);
    this.productService.updateCategory(category, id).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.info('Product Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allCategory.splice(this.currentIndex, 1, res.data)
      this.currentcategoryId = null;
      this.editing = false;
    });
  }

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      is_active: ['', Validators.required]
    });
  }

  setFormValue() {
    const category = this.allCategory[this.currentIndex];
    this.categoryForm.controls['name'].setValue(category.name);
    this.categoryForm.controls['is_active'].setValue(category.is_active);
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
  //     }
  //   }
  // }

  // public extractData() {
  //   this.uploading = true;
  //   const lines = this.parsedCSV.split(/\r\n|\n/);
  //   const result = [];
  //   const headers: any[] = lines[0].split(",");
  //   if (headers[0] == "brand" && headers[1] == "is_active" && headers[2] == "cif_price" && headers[3] == "business_unit"
  //     && headers[4] == "business_unit_id" && headers[5] == "distirbutor"
  //     && headers[6] == "form" && headers[7] == "notes" && headers[8] == "pack_size"
  //     && headers[9] == "promoted" && headers[10] == "range" && headers[11] == "registered"
  //     && headers[12] == "strength" && headers[13] == "therapy_line_id" && headers[14] == "therapy_line"
  //     && headers[15] == "whole_price" && headers[16] == "sku_id"
  //   ) {
  //     for (var i = 1; i < lines.length - 1; i++) {
  //       const obj = {};
  //       const currentline = lines[i].split(",");
  //       for (var j = 0; j < headers.length; j++) {
  //         obj[headers[j]] = currentline[j];
  //       }
  //       result.push(obj);
  //     }
  //     this.productService.importCustomer(result).subscribe((res: ResponseModel) => {
  //       setTimeout(() => {
  //         this.uploading = false;
  //         this.toastr.success('Product added successfully', 'Upload Success');
  //         jQuery("#modal2").modal("hide");
  //         this.allproducts.push(res.data);
  //       }, 1000);
  //     });
  //     // this.newproduct = result;
  //   } else {
  //     this.toastr.error('Try Again', 'Upload Failed')
  //     // this.reset();
  //   }
  // }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.categoryForm.reset();
  }
}
