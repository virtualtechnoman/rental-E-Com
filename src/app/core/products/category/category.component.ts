import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CategoryModel } from '../shared/product.model';
import { Subject } from 'rxjs';
import { ProductsService } from '../shared/products.service';
import { ResponseModel } from '../../../shared/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductsCategoryService } from './shared/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  imageUrl = 'https://binsar.s3.ap-south-1.amazonaws.com/';
  breadcrumArray: any[] = [];
  submitted = false;
  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  editing: Boolean = false;
  currentcategory: any;
  dtOptions: any = {};
  currentcategoryId: String;
  currentIndex: number;
  dtTrigger: Subject<any> = new Subject();
  allCategory: any[] = [];
  viewArray: any = [];
  fileSelected: any;
  keyCategoryImage: any;
  urlCategoryImage: any;
  showImage: Boolean = false;
  image: any;
  editShowImage: Boolean = false;
  editImage: any;
  mastImage: any;
  attributeForm: FormGroup;
  allAttributes: any[] = [];
  showAttributeFor: Boolean = false;
  categorySelectedId: any;
  specificCategoryAttributes: any[] = []
  showSpecificCategoryAttributesLength: Boolean = false;
  deleteIndex: any;
  constructor(private formBuilder: FormBuilder,
    private productService: ProductsService,
    private toastr: ToastrService,
    private router: Router,
    private titleService: Title,
    private productsCategoryService: ProductsCategoryService,
  ) {
    this.titleService.setTitle('Category Management');
    this.initForm();
  }

  ngOnInit() {
    this.getCategory();
  }


  get f() { return this.categoryForm.controls; }

  initDatatable() {
    $('#example').DataTable().clear().destroy();
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search Category',
      },
      dom: "<'row'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-3'B><'col-sm-12 col-md-4'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      initComplete: function (settings, json) {
        $('.button').removeClass('dt-button');
      },
      buttons: [
        {
          extend: 'copyHtml5',
          text: '<i class="far fa-copy"></i>',
          className: ' color ',
          titleAttr: 'Copy'
        },
        {
          extend: 'excelHtml5',
          text: '<i class="fas fa-file-excel"></i>',
          className: 'color ',
          titleAttr: 'Excel'
        },
        {
          extend: 'csvHtml5',
          text: '<i class="fas fa-file-csv"></i>',
          className: 'color',
          titleAttr: 'CSV'
        },
        {
          extend: 'print',
          text: '<i class="fas fa-print"></i>',
          className: 'color',
          titleAttr: 'Print'
        }
      ]
    };
  }

  submit() {
    this.submitted = true;
    if (!(this.categorySelectedId) && !(this.editing)) {
      this.categoryForm.get('type').setValue('category');
      this.categoryForm.removeControl('parent');
    } else {
      this.categoryForm.get('type').setValue('subcategory');
      this.categoryForm.get('parent').setValue(this.categorySelectedId);
    }
    if (this.categoryForm.invalid) {
      console.log('Invalid Form');
      return;
    }
    if (this.editing) {
      this.updateCategory(this.categoryForm.value);
    } else {
      this.addCategory(this.categoryForm.value);
    }
  }

  getCategory() {
    this.initDatatable();
    this.allCategory.length = 0;
    this.productService.getAllCategory().subscribe((res: ResponseModel) => {
      this.allCategory = res.data;
      this.categorySelectedId = undefined;
      this.dtTrigger.next();
    });
  }

  getAllCategory(id, name) {
    this.initDatatable();
    this.breadcrumArray.push({ id: id, name: name });
    this.allCategory.length = 0;
    this.productsCategoryService.getAllCategorysub(id).subscribe((res: ResponseModel) => {
      if (res.errors) {
        this.toastr.error(res.message);
      } else {
        this.toastr.info(res.data.length + ' ' + 'Categories Found')
        this.allCategory = res.data;
        this.dtTrigger.next();
      }
    });
  }

  addCategory(category) {
    this.categoryForm.get('type').setValue('value');
    this.categoryForm.removeControl('parent');
    this.productService.addCategory(category).subscribe((res: ResponseModel) => {
      if (res.errors) {
        this.toastr.error('Error While Adding', 'Error');
      } else {
        jQuery('#modal3').modal('hide');
        if (!(this.categorySelectedId) && !(this.editing)) {
          this.allCategory.push(res.data);
          this.toastr.success('Category Added!', 'Success!');
        } else {

          this.toastr.success('Subcategory Added!', 'Success!');
        }
        jQuery('#example').modal('hide');
      }
      this.resetForm();
    });
  }

  addSubCategory(i) {
    this.categorySelectedId = i;
    this.categoryForm.get('parent').setValue(i);
    this.categoryForm.get('type').setValue('subcategory');
    this.editing = false;
  }

  viewCategory(i) {
    this.viewArray = this.allCategory[i];
    this.categorySelectedId = this.allCategory[i]._id;
    if (this.allCategory[i]._id) {
      this.productService.getAllAttributeSpecificCategory(this.allCategory[i]._id).subscribe((res: ResponseModel) => {
        if (res.data) {
          this.specificCategoryAttributes = res.data[0];
        }
      });
    }
    if (this.viewArray.image) {
      this.showImage = true;
      this.image = this.imageUrl + this.viewArray.image;
      console.log(this.image);
    } else {
      this.showImage = false;
    }
  }

  editCategory(i) {
    this.editing = true;
    this.currentcategory = this.allCategory[i];
    this.currentcategoryId = this.allCategory[i]._id;
    this.currentIndex = i;
    // this.router.navigate(['/subcategory/', this.currentcategoryId]);
    this.setFormValue();
  }

  deleteCategory(i) {
    this.deleteIndex = i;
  }

  yesDelete() {
    this.productService.deleteCategory(this.allCategory[this.deleteIndex]._id).toPromise().then(() => {
      this.toastr.warning('Products Deleted!', 'Deleted!');
      this.allCategory.splice(this.deleteIndex, 1);
      this.deleteIndex = null;
      jQuery('#deleteCategoryModal').modal('hide');
    }).catch((err) => console.log(err));
  }

  updateCategory(category) {
    const id = this.allCategory[this.currentIndex]._id;
    this.productService.updateCategory(category, id).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.info('Category Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allCategory.splice(this.currentIndex, 1, res.data);
      this.currentcategoryId = null;
      this.editing = false;
    });
  }

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      parent: [''],
      type: ['', Validators.required],
    });
  }

  setFormValue() {
    const category: any = this.allCategory[this.currentIndex];
    this.categoryForm.controls['name'].setValue(category.name);
  }

  get attributesForm() {
    return this.attributeForm.get('name') as FormArray;
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.editShowImage = false;
    this.categorySelectedId = null;
    this.currentcategoryId = null;
    this.currentIndex = null;
    this.categoryForm.reset();
    this.initForm();
  }

  breadcrumFunction(i, id) {
    this.initDatatable();
    this.breadcrumArray.splice(i);
    this.allCategory.length = 0;
    this.productsCategoryService.getAllCategorysub(id).subscribe((res: ResponseModel) => {
      if (res.errors) {
        this.toastr.error(res.message);
      } else {
        this.toastr.info(res.data.length + ' ' + 'Categories Found')
        this.allCategory = res.data;
        this.dtTrigger.next();
      }
    });
  }
}
